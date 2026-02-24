const fetchSun = async () => {
  const res = await fetch("https://api.le-systeme-solaire.net/rest/bodies/sun");
  const data = await res.json();
  console.log(data);
};

fetchSun();
