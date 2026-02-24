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


async function solveChallenge3() {
  console.log("🪐 Solving Challenge 3 (Shortest Day)...");

  const planetsData = await getJSON(
    `${SOLAR_BASE}/bodies?filter[]=isPlanet,eq,true`,
    true
  );

  let fastestPlanet = null;
  let shortestDay = Infinity;

  for (const planet of planetsData.bodies) {
    if (!planet.sideralRotation) continue;

    const rotation = Math.abs(planet.sideralRotation);

    console.log(`${planet.englishName} day length: ${rotation} hours`);

    if (rotation < shortestDay) {
      shortestDay = rotation;
      fastestPlanet = planet.englishName.toLowerCase();
    }
  }

  console.log(`Answer 3: ${fastestPlanet}`);
  return fastestPlanet;
}


async function solveChallenge4() {
  console.log("🌙 Solving Challenge 4 (Jupiter's Moons)...");

  const jupiter = await getJSON(`${SOLAR_BASE}/bodies/jupiter`, true);

  const moonCount = jupiter.moons ? jupiter.moons.length : 0;

  console.log(`Answer 4: ${moonCount}`);

  return moonCount;
}



async function solveChallenge5() {
  console.log("🌙 Solving Challenge 5 (Largest Moon of Jupiter)...");

  const jupiter = await getJSON(`${SOLAR_BASE}/bodies/jupiter`, true);

  let largestMoon = null;
  let largestRadius = 0;

  for (const moon of jupiter.moons) {
    const moonData = await getJSON(moon.rel, true);

    if (moonData.meanRadius && moonData.meanRadius > largestRadius) {
      largestRadius = moonData.meanRadius;
      largestMoon = moonData.englishName.toLowerCase();
    }
  }

  console.log(`Answer 5: ${largestMoon}`);

  return largestMoon;
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
    await postJSON(`${RIS_BASE}/answer`, {
      answer: answer2,
      player: PLAYER,
    });

    const answer3 = await solveChallenge3();
    const result3 = await postJSON(`${RIS_BASE}/answer`, {
      answer: answer3,
      player: PLAYER,
    });

    const answer4 = await solveChallenge4();
    const result4 = await postJSON(`${RIS_BASE}/answer`, {
      answer: answer4,
      player: PLAYER,
    });

    const answer5 = await solveChallenge5();
    const result5 = await postJSON(`${RIS_BASE}/answer`, {
      answer: answer5,
      player: PLAYER,
    });

    console.log("\n🛰 RIS Response:");
    console.log(result5);
  } catch (err) {
    console.error("❌ Mission failed:", err.message);
  }
}

runMission();
