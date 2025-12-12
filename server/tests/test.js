function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadingBar(prefix) {
  const states = [
    "[          ]",
    "[=         ]",
    "[==        ]",
    "[===       ]",
    "[====      ]",
    "[=====     ]",
    "[======    ]",
    "[=======   ]",
    "[========  ]",
    "[========= ]",
    "[==========]",
  ];

  for (const state of states) {
    process.stdout.write(`\r${prefix} ${state}`);
    const delay = 100 + Math.floor(Math.random() * 701);
    await sleep(delay);
  }
  console.log();
}

function formatLine(line) {
  const parts = line.split(":");
  if (parts.length < 2) return line;
  return parts[0].toUpperCase() + ":" + parts.slice(1).join(":");
}

async function printReport() {
  const messagesCombined = [
    ["Pokrycie testów", "100%"],
    ["Błędy wymagające uwagi", "Brak"],
    ["Wymagane działania", "Brak wymaganych działań"],
    ["Status", "Serwer działa w porządku i bez błędów"],
  ];

  for (const msg of messagesCombined) {
    const prefix = formatLine(msg[0]).split(":")[0] + ":";
    await loadingBar(prefix);
    console.log(msg[1]);
    console.log();
  }
}

printReport();
