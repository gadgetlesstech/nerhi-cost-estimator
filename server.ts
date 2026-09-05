import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());
// Serve public assets (logos, images, favicons)
app.use(express.static(path.join(process.cwd(), "public")));

// In-memory leads storage (for easy upload to any Node.js hosting / subdomain)
interface LeadRecord {
  id: string;
  type: "estimator" | "direct_schedule";
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  cityOrTown?: string;
  serviceNeeded?: string;
  roofAge?: string;
  notes?: string;
  estimateDetails?: {
    squareFootage: number;
    stories: string;
    slope: string;
    shingleGrade: string;
    skylights: number;
    chimneys: number;
    roofVents: number;
    replaceGutters: boolean;
    estimatedSquares: number;
    lowEstimate: number;
    highEstimate: number;
  };
}

const leadsStore: LeadRecord[] = [];

async function sendLeadNotificationEmail(lead: LeadRecord): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipients = (process.env.LEAD_NOTIFICATION_EMAILS || "")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);

  if (!apiKey || !from || recipients.length === 0) {
    console.warn("[Lead Notification] Skipped: RESEND_API_KEY, RESEND_FROM_EMAIL, or LEAD_NOTIFICATION_EMAILS not configured.");
    return;
  }

  const subject = `New ${lead.type === "direct_schedule" ? "Consultation Request" : "Estimate Lead"}: ${lead.fullName}`;
  const html = `
    <h2>New Lead from Roof Cost Estimator</h2>
    <p><strong>Name:</strong> ${lead.fullName}</p>
    <p><strong>Email:</strong> ${lead.email || "—"}</p>
    <p><strong>Phone:</strong> ${lead.phone || "—"}</p>
    <p><strong>City/Town:</strong> ${lead.cityOrTown}</p>
    <p><strong>Service Needed:</strong> ${lead.serviceNeeded}</p>
    <p><strong>Roof Age:</strong> ${lead.roofAge}</p>
    <p><strong>Notes:</strong> ${lead.notes || "—"}</p>
    ${
      lead.estimateDetails
        ? `<h3>Estimate Details</h3>
           <p>Square Footage: ${lead.estimateDetails.squareFootage}, Stories: ${lead.estimateDetails.stories}, Slope: ${lead.estimateDetails.slope}</p>
           <p>Shingle Grade: ${lead.estimateDetails.shingleGrade}, Estimated Squares: ${lead.estimateDetails.estimatedSquares}</p>
           <p>Estimated Range: $${lead.estimateDetails.lowEstimate} - $${lead.estimateDetails.highEstimate}</p>`
        : ""
    }
    <p><em>Lead ID: ${lead.id} | Received: ${lead.timestamp}</em></p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: recipients, subject, html }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
}

// API Health
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    company: "Northeast Roofing & Home Improvement",
    timestamp: new Date().toISOString(),
  });
});

// API: Detailed Roof Cost Estimation
app.post("/api/estimate", (req, res) => {
  try {
    const {
      squareFootage = 2000,
      stories = "2",
      slope = "normal", // 'flat', 'normal', 'steep'
      shingleGrade = "standard", // 'standard', 'premium', 'both'
      skylights = 0,
      chimneys = 0,
      roofVents = 0,
      replaceGutters = false,
    } = req.body;

    const sqFt = Number(squareFootage) || 2000;
    const storiesNum = parseFloat(stories) || 2;

    // Ground footprint calculation based on stories
    // A 2-story 2,400 sq ft home has ~1,200 sq ft ground footprint
    const groundFootprint = sqFt / (storiesNum >= 3 ? 2.8 : storiesNum >= 2 ? 1.9 : storiesNum >= 1.5 ? 1.4 : 1.0);

    // Pitch multiplier:
    // Flat / low slope: 1.05 - 1.10
    // Normal / moderate slope (5/12 - 8/12): 1.15 - 1.22
    // Steep slope (9/12+): 1.35 - 1.45
    let pitchMultiplier = 1.18;
    let pitchDifficultyCostPerSq = 0;
    if (slope === "flat") {
      pitchMultiplier = 1.08;
      pitchDifficultyCostPerSq = 0;
    } else if (slope === "steep") {
      pitchMultiplier = 1.38;
      pitchDifficultyCostPerSq = 35; // added safety setup / scaffolding / harness time
    }

    // Overhang / eave factor: typical 1.10 multiplier
    const rawRoofArea = groundFootprint * pitchMultiplier * 1.12;

    // 10% - 12% cut/waste factor for hips, valleys, starter strips
    const totalRoofAreaWithWaste = rawRoofArea * 1.12;

    // A roofing square is 100 sq ft
    const squares = Math.ceil(totalRoofAreaWithWaste / 100);

    // Cost rates for Fairfield County, CT (realistic competitive pricing):
    // Standard Architectural Shingle (GAF Timberline HDZ / CertainTeed Landmark):
    // Material: ~$140 - $185 per square (shingles, synthetic underlayment, ice & water shield, drip edge, ridge caps, starter strips, coil nails)
    // Tear-off & Labor: ~$230 - $290 per square (tear-off 1-layer, deck inspection/nailing, installation, magnetic sweep, dumpster disposal)
    const standardCostPerSquareLow = 420 + pitchDifficultyCostPerSq;
    const standardCostPerSquareHigh = 510 + pitchDifficultyCostPerSq;

    // Premium Designer Shingles (GAF Grand Canyon / Camelot II / CertainTeed Grand Manor / Presidential Shake):
    // Material & Labor: ~$620 - $780 per square
    const premiumCostPerSquareLow = 620 + pitchDifficultyCostPerSq;
    const premiumCostPerSquareHigh = 760 + pitchDifficultyCostPerSq;

    let baseRateLow = standardCostPerSquareLow;
    let baseRateHigh = standardCostPerSquareHigh;

    if (shingleGrade === "premium") {
      baseRateLow = premiumCostPerSquareLow;
      baseRateHigh = premiumCostPerSquareHigh;
    }

    let materialAndLaborLow = squares * baseRateLow;
    let materialAndLaborHigh = squares * baseRateHigh;

    // Additional penetrations & flashing
    const skylightCost = Number(skylights) * 350; // flashing kit + ice & water tie-in
    const chimneyCost = Number(chimneys) * 450; // step & counter flashing with custom lead / copper
    const ventCost = Number(roofVents) * 95; // pipe boot flashing & ridge vent tie-in

    // Gutters (approx 150-220 linear feet for typical CT home)
    const gutterLinearFeet = Math.round(Math.sqrt(groundFootprint) * 3.2);
    const gutterCost = replaceGutters ? gutterLinearFeet * 14 : 0; // seamless aluminum 5"/6" + guards

    // September promotional discount ($1,000 off)
    const promotionalDiscount = 1000;

    const subtotalLow = materialAndLaborLow + skylightCost + chimneyCost + ventCost + gutterCost;
    const subtotalHigh = materialAndLaborHigh + skylightCost + chimneyCost + ventCost + gutterCost;

    const finalLow = Math.max(3500, Math.round((subtotalLow - promotionalDiscount) / 50) * 50);
    const finalHigh = Math.max(4500, Math.round((subtotalHigh - promotionalDiscount) / 50) * 50);

    // Premium comparison numbers for "both" option
    const premiumFinalLow = Math.round((squares * premiumCostPerSquareLow + skylightCost + chimneyCost + ventCost + gutterCost - promotionalDiscount) / 50) * 50;
    const premiumFinalHigh = Math.round((squares * premiumCostPerSquareHigh + skylightCost + chimneyCost + ventCost + gutterCost - promotionalDiscount) / 50) * 50;

    // Estimated monthly financing (approx 9.99% 120-month or 12-month same as cash)
    const monthlyPaymentEstimate = Math.round((finalLow * 0.0125));

    res.json({
      success: true,
      data: {
        squares,
        approxRoofAreaSqFt: Math.round(squares * 100),
        estimatedRange: {
          low: finalLow,
          high: finalHigh,
        },
        premiumRange: {
          low: premiumFinalLow,
          high: premiumFinalHigh,
        },
        promotionalDiscount,
        monthlyPaymentEstimate,
        breakdown: {
          laborAndTearOff: Math.round(squares * 240),
          materialsAndUnderlayment: Math.round(squares * (shingleGrade === "premium" ? 420 : 200)),
          flashingAndPenetrations: skylightCost + chimneyCost + ventCost,
          guttersAndGuards: gutterCost,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// API: Save Lead / Schedule Consultation
app.post("/api/leads", (req, res) => {
  try {
    const { fullName, email, phone, cityOrTown, serviceNeeded, roofAge, notes, estimateDetails, type = "estimator" } = req.body;

    if (!fullName || (!email && !phone)) {
      return res.status(400).json({ success: false, message: "Name and contact info are required." });
    }

    const newLead: LeadRecord = {
      id: `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      timestamp: new Date().toISOString(),
      fullName,
      email: email || "",
      phone: phone || "",
      cityOrTown: cityOrTown || "Fairfield County, CT",
      serviceNeeded: serviceNeeded || "Roof Replacement",
      roofAge: roofAge || "Unspecified",
      notes: notes || "",
      estimateDetails,
    };

    leadsStore.unshift(newLead);
    console.log(`[New Lead Received] ${newLead.fullName} (${newLead.phone}) - ${newLead.serviceNeeded}`);

    sendLeadNotificationEmail(newLead).catch((err) => {
      console.error("[Lead Notification] Failed to send email:", err.message);
    });

    res.status(201).json({
      success: true,
      leadId: newLead.id,
      message: "Lead successfully recorded. Our team will follow up promptly!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: View Leads (Admin / Export)
app.get("/api/leads", (req, res) => {
  res.json({
    total: leadsStore.length,
    leads: leadsStore,
  });
});

// Production & Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Northeast Roofing app server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
