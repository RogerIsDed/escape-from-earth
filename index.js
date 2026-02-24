const PLAYER = "Oliversto@uia.no";

const RIS_BASE = "https://spacescavanger.onrender.com";
const SOLAR_BASE = "https://api.le-systeme-solaire.net/rest";

const SOLAR_API_KEY = "9e494129-addc-42f8-b76e-8eff6ec06ec2";

async function getJSON(url, useSolarAuth = false) {
  const headers = {};

  if (useSolarAuth) {
    headers["Authorization"] = `Bearer ${SOLAR_API_KEY}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GET failed: ${response.status} ${text}`);
  }

  return response.json();
}

async function postJSON(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`POST failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function startMission() {
  try {
    console.log("🚀 Contacting Resistance Infiltration System...");

    const startUrl = `${RIS_BASE}/start?player=${PLAYER}`;
    const missionData = await getJSON(startUrl);

    console.log("\n📜 Mission Instructions:");
    console.log(missionData.challenge);

    console.log("\n🌞 Accessing Solar System Database...");

    const sunData = await getJSON(
      `${SOLAR_BASE}/bodies/sun`,
      true
    );

    const equatorialRadius = sunData.equaRadius;
    const meanRadius = sunData.meanRadius;

    console.log(`Equatorial Radius: ${equatorialRadius}`);
    console.log(`Mean Radius: ${meanRadius}`);

    const difference = equatorialRadius - meanRadius;

    console.log(`\n🔐 Calculated Access Pin: ${difference}`);

    console.log("\n📡 Sending answer to RIS...");

    const answerResponse = await postJSON(`${RIS_BASE}/answer`, {
      answer: difference,
      player: PLAYER,
    });

    console.log("\n🛰 RIS Response:");
    console.log(answerResponse);
  } catch (error) {
    console.error("❌ Mission failed:", error.message);
  }
}

startMission();
