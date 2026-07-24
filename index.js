import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const start = moment("2026-04-01");
const end = moment("2026-07-23");
const git = simpleGit();

function naturalCommits(dayIdx, day, totalDays) {
  const wd = day.day();
  const weekend = wd === 0 || wd === 6;
  if (weekend && random.float(0, 1) < 0.35) return 0;
  if (random.float(0, 1) < 0.07) return 0;
  const r = random.float(0, 1);
  if (r < 0.15) return 1;
  if (r < 0.45) return 2;
  if (r < 0.75) return 3;
  return 4;
}

function randomTime() {
  const h = random.int(9, 23);
  const m = random.int(0, 59);
  const s = random.int(0, 59);
  return { h, m, s };
}

async function run() {
  const days = [];
  let cur = start.clone();
  while (cur.isSameOrBefore(end)) {
    days.push(cur.clone());
    cur.add(1, "d");
  }

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const n = naturalCommits(i, day, days.length);
    for (let j = 0; j < n; j++) {
      const t = randomTime();
      const ts = day.clone().hour(t.h).minute(t.m).second(t.s).format("YYYY-MM-DD HH:mm:ss");
      jsonfile.writeFileSync(path, { date: ts });
      await git.add([path]);
      await git.commit(ts, { "--date": ts });
      console.log(ts);
    }
  }

  await git.push(["--set-upstream", "origin", "main"]);
  console.log("done");
}

run().catch((e) => console.error(e));
