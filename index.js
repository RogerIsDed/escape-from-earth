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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`POST failed: ${response.status} ${text}`);
  }

  return response.json();
}

async function solveChallenge1() {
  console.log("🌞 Solving Challenge 1...");

  const sun = await getJSON(`${SOLAR_BASE}/bodies/sun`, true);
  const difference = sun.equaRadius - sun.meanRadius;

  console.log(`Answer 1: ${difference}`);

  return difference;
}

async function solveChallenge2() {
  console.log("🌍 Solving Challenge 2...");

  const earth = await getJSON(`${SOLAR_BASE}/bodies/earth`, true);
  const earthTilt = earth.axialTilt;

  const planetsData = await getJSON(
    `${SOLAR_BASE}/bodies?filter[]=isPlanet,eq,true`,
    true
  );

  let closestPlanet = null;
  let smallestDifference = Infinity;

  for (const planet of planetsData.bodies) {
    if (planet.englishName === "Earth") continue;

    const diff = Math.abs(planet.axialTilt - earthTilt);

    if (diff < smallestDifference) {
      smallestDifference = diff;
      closestPlanet = planet.englishName.toLowerCase();
    }
  }

  console.log(`Answer 2: ${closestPlanet}`);

  return closestPlanet;
}

async function runMission() {
  try {
    console.log("🚀 Starting Mission...");

    
    await getJSON(`${RIS_BASE}/start?player=${PLAYER}`);

    
    const answer1 = await solveChallenge1();
    await postJSON(`${RIS_BASE}/answer`, {
      answer: answer1,
      player: PLAYER,
    });

    
    const answer2 = await solveChallenge2();
    const result2 = await postJSON(`${RIS_BASE}/answer`, {
      answer: answer2,
      player: PLAYER,
    });

    console.log("\n🛰 RIS Response:");
    console.log(result2);
  } catch (err) {
    console.error("❌ Mission failed:", err.message);
  }
}

runMission();
