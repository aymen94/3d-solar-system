import earthDay from "./textures/earth_day_4096.jpg";
import mercuryTexture from "./textures/2k_mercury.jpg";
import venusTexture from "./textures/2k_venus.jpg";
import marsTexture from "./textures/2k_mars.jpg";
import jupiterTexture from "./textures/2k_jupiter.jpg";
import saturnTexture from "./textures/2k_saturn.jpg";
import uranusTexture from "./textures/2k_uranus.jpg";
import neptuneTexture from "./textures/2k_neptune.jpg";

export default [
  {
    name: "Earth",
    distance: 8,
    texture: earthDay,
    speed: 0.02,
    hasRings: false,
    yearLength: 365,
    mass: 5.972e24,
    radius: 6371,
    gravity: 9.8,
    satellite: ["Moon"],
    description:
      "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It has a diverse climate, ranging from polar ice caps to tropical rainforests. Approximately 71% of Earth's surface is covered by water, making it unique in the Solar System. Earth also has a natural satellite, the Moon, which influences ocean tides and has played a crucial role in the evolution of life on the planet.",
  },
  {
    name: "Mercury",
    distance: 5,
    texture: mercuryTexture,
    speed: 0.04,
    hasRings: false,
    yearLength: 88,
    mass: 3.285e23,
    radius: 2439.7,
    gravity: 3.7,
    satellite: [],
    description:
      "Mercury is the smallest planet in the Solar System and the closest to the Sun. It has a very thin atmosphere, which means that it experiences extreme temperature variations. During the day, temperatures can reach up to 430°C, while at night they can drop to -180°C. Mercury is heavily cratered, resembling Earth's Moon, due to its lack of a protective atmosphere.",
  },
  {
    name: "Venus",
    distance: 6.5,
    texture: venusTexture,
    speed: 0.015,
    hasRings: false,
    yearLength: 225,
    mass: 4.867e24,
    radius: 6051.8,
    gravity: 8.87,
    satellite: [],
    description:
      "Venus is the second planet from the Sun and has a thick, toxic atmosphere composed mostly of carbon dioxide, with clouds of sulfuric acid. It has an extreme greenhouse effect, making it the hottest planet in the Solar System, with surface temperatures reaching 475°C. Venus rotates very slowly and in the opposite direction to most other planets, causing its day to be longer than its year.",
  },
  {
    name: "Mars",
    distance: 10,
    texture: marsTexture,
    speed: 0.01,
    hasRings: false,
    yearLength: 687,
    mass: 6.39e23,
    radius: 3389.5,
    gravity: 3.71,
    satellite: ["Phobos", "Deimos"],
    description:
      "Mars is the fourth planet from the Sun and is often called the 'Red Planet' due to its reddish appearance, which comes from iron oxide (rust) on its surface. It has the largest volcano in the Solar System, Olympus Mons, as well as a massive canyon system, Valles Marineris. Mars has polar ice caps, seasons like Earth, and evidence suggests that it once had liquid water on its surface, raising questions about the possibility of past life.",
  },
  {
    name: "Jupiter",
    distance: 14,
    texture: jupiterTexture,
    speed: 0.008,
    hasRings: false,
    yearLength: 4333,
    mass: 1.898e27,
    radius: 69911,
    gravity: 24.79,
    satellite: ["Io", "Europa", "Ganymede", "Callisto"],
    description:
      "Jupiter is the largest planet in the Solar System and is known for its Great Red Spot, a giant storm that has been raging for hundreds of years. It is a gas giant, composed mostly of hydrogen and helium, with a faint ring system and at least 79 moons. The largest of its moons, Ganymede, is the biggest moon in the Solar System, even larger than the planet Mercury. Jupiter's powerful magnetic field and intense radiation make it a fascinating but hostile environment.",
  },
  {
    name: "Saturn",
    distance: 18,
    texture: saturnTexture,
    speed: 0.007,
    hasRings: true,
    yearLength: 10759,
    mass: 5.683e26,
    radius: 58232,
    gravity: 10.44,
    satellite: ["Titan", "Enceladus", "Rhea", "Iapetus"],
    description:
      "Saturn is the sixth planet from the Sun and is best known for its extensive and beautiful ring system, which is made up of countless small ice and rock particles. Saturn is a gas giant, mostly composed of hydrogen and helium, and has at least 83 moons, including Titan, the second-largest moon in the Solar System. Titan has a thick atmosphere and lakes of liquid methane, making it a unique and intriguing world for scientists to study.",
  },
  {
    name: "Uranus",
    distance: 22,
    texture: uranusTexture,
    speed: 0.005,
    hasRings: true,
    yearLength: 30687,
    mass: 8.681e25,
    radius: 25362,
    gravity: 8.69,
    satellite: ["Miranda", "Ariel", "Umbriel", "Titania", "Oberon"],
    description:
      "Uranus is the seventh planet from the Sun and has a blue-green color due to methane in its atmosphere. It is unique in that it rotates on its side, making its axis nearly parallel to the plane of the Solar System. This unusual tilt gives Uranus extreme seasonal variations. Uranus has a faint ring system and 27 known moons, with Miranda, one of its moons, featuring a highly varied and strange surface with massive cliffs and other features that suggest a complex geological history.",
  },
  {
    name: "Neptune",
    distance: 26,
    texture: neptuneTexture,
    speed: 0.004,
    hasRings: false,
    yearLength: 60190,
    mass: 1.024e26,
    radius: 24622,
    gravity: 11.15,
    satellite: ["Triton", "Proteus", "Nereid"],
    description:
      "Neptune is the eighth and farthest known planet from the Sun in the Solar System. It has a deep blue color, also caused by methane in its atmosphere, and is known for having the strongest winds in the Solar System, with speeds reaching up to 2,100 km/h. Neptune has a faint ring system and 14 known moons, including Triton, which is geologically active and has geysers that eject nitrogen gas. Triton also has a retrograde orbit, suggesting that it was likely a captured object rather than having formed in place.",
  },
];
