
const PLAYER = "Oliversto@uia.no"; 

const RIS_BASE = "https://spacescavanger.onrender.com";
const SOLAR_BASE = "https://api.le-systeme-solaire.net/rest";



async function getJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GET failed: ${response.status} ${response.statusText}`);
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

    // Fetch sun data
    const sunData = await getJSON(`${SOLAR_BASE}/bodies/sun`);

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
