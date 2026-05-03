const indianElectionData = [
  {
    id: "announcement",
    title: "Election Announcement",
    date: "Usually 6-8 weeks before voting",
    badge: "Phase 1",
    description: "The Election Commission of India (ECI) announces the election schedule, including voting phases and counting day. The Model Code of Conduct comes into effect immediately.",
    keyPoints: [
      "ECI holds a press conference to announce dates.",
      "Model Code of Conduct (MCC) restricts government from announcing new schemes.",
      "Ensures a level playing field for all political participants."
    ],
    funFact: "The Model Code of Conduct is a set of guidelines, not a law, but it is strictly enforced by the ECI to prevent the ruling party from gaining an unfair advantage."
  },
  {
    id: "nominations",
    title: "Filing Nominations",
    date: "A few weeks after announcement",
    badge: "Phase 2",
    description: "Candidates file their nomination papers with the Returning Officer of their constituency along with affidavits detailing their assets, liabilities, and criminal records (if any).",
    keyPoints: [
      "Candidates submit Form 2A/2B and an affidavit (Form 26).",
      "Scrutiny of nominations takes place to verify validity.",
      "Candidates have a window to withdraw their nomination."
    ],
    funFact: "Any Indian citizen over 25 years of age can contest Lok Sabha elections, provided they are registered as a voter in any parliamentary constituency."
  },
  {
    id: "campaigning",
    title: "Campaigning",
    date: "Up to 48 hours before polling",
    badge: "Phase 3",
    description: "Political parties and candidates hold rallies, roadshows, and distribute manifestos. Campaigning strictly stops 48 hours before the voting day (Silence Period).",
    keyPoints: [
      "Release of party manifestos outlining promises.",
      "Public rallies, door-to-door campaigning, and digital outreach.",
      "Strict enforcement of the 48-hour 'Silence Period' before voting."
    ],
    funFact: "During the 48-hour Silence Period, no one is allowed to use loudspeakers, hold public meetings, or broadcast election-related content on TV."
  },
  {
    id: "polling",
    title: "Polling Days",
    date: "Multiple phases over weeks",
    badge: "Phase 4",
    description: "Voters cast their votes using Electronic Voting Machines (EVMs) equipped with Voter Verifiable Paper Audit Trail (VVPAT) machines across designated polling stations.",
    keyPoints: [
      "Voting is often held in multiple phases for security reasons.",
      "Use of EVMs and VVPATs ensures transparency.",
      "Security forces are deployed to ensure peaceful voting."
    ],
    funFact: "The ECI sets up polling stations so that no voter has to travel more than 2 kilometers to cast their vote."
  },
  {
    id: "counting",
    title: "Counting & Results",
    date: "Scheduled Counting Day",
    badge: "Phase 5",
    description: "Votes are counted simultaneously across the country under the supervision of Returning Officers. The candidate with the most votes in a constituency wins (First Past the Post).",
    keyPoints: [
      "EVMs are opened in secure counting centers.",
      "Results are declared constituency-wise.",
      "The party or coalition with a majority (272+ seats) forms the government."
    ],
    funFact: "India follows the 'First Past the Post' system, meaning the candidate with the highest number of votes wins, even if they don't secure an absolute majority."
  }
];

const usElectionData = [
  {
    id: "primaries",
    title: "Primaries & Caucuses",
    date: "Jan - June of Election Year",
    badge: "Phase 1",
    description: "States hold primaries or caucuses to award delegates to candidates. This is how parties decide who their final nominee will be.",
    keyPoints: [
      "Primaries are state-run elections; Caucuses are local gatherings.",
      "Candidates earn delegates based on their performance.",
      "Crucial early states (like Iowa and New Hampshire) set the momentum."
    ],
    funFact: "The Iowa Caucuses and New Hampshire Primaries are traditionally the first contests and receive immense media attention, often shaping the rest of the race."
  },
  {
    id: "conventions",
    title: "National Conventions",
    date: "July - August",
    badge: "Phase 2",
    description: "Parties hold massive conventions where delegates officially cast their votes to formally nominate the party's Presidential and Vice Presidential candidates.",
    keyPoints: [
      "Official confirmation of the party's nominee.",
      "The nominee officially announces their Vice Presidential pick (running mate).",
      "The party platform is finalized and adopted."
    ],
    funFact: "While today the nominee is usually known well before the convention, historically, conventions were unpredictable events where candidates were truly chosen on the floor."
  },
  {
    id: "general_campaign",
    title: "General Election Campaign",
    date: "Sept - October",
    badge: "Phase 3",
    description: "The official nominees campaign nationwide, focusing heavily on 'Swing States' where the vote could go either way. Presidential debates are held.",
    keyPoints: [
      "Intense focus on battleground/swing states.",
      "Nationally televised Presidential and Vice Presidential debates.",
      "Massive advertising and ground game efforts."
    ],
    funFact: "Because of the Electoral College system, candidates often spend almost all their time and money campaigning in just a handful of 'Swing States'."
  },
  {
    id: "election_day",
    title: "Election Day",
    date: "First Tuesday following first Monday in Nov",
    badge: "Phase 4",
    description: "Citizens cast their ballots. While they vote for a candidate, they are actually voting for a slate of 'electors' pledged to that candidate in their state.",
    keyPoints: [
      "Millions vote in person or via mail-in ballots.",
      "Media networks project winners state-by-state as polls close.",
      "The goal is reaching 270 Electoral Votes, not necessarily the popular vote."
    ],
    funFact: "Election Day is always the Tuesday following the first Monday in November. This rule was established in 1845 to fit an agrarian society's harvest schedule."
  },
  {
    id: "electoral_college",
    title: "Electoral College Vote",
    date: "Mid-December",
    badge: "Phase 5",
    description: "The Electors meet in their respective states to officially cast their votes for President and Vice President. These votes are later counted by Congress in January.",
    keyPoints: [
      "538 total electoral votes; 270 needed to win.",
      "Most states award all their electoral votes to the state's popular vote winner.",
      "Congress officially certifies the results on January 6th."
    ],
    funFact: "There are 538 total electoral votes (435 Representatives + 100 Senators + 3 for Washington D.C.). A candidate needs a simple majority of 270 to win the presidency."
  }
];

export { indianElectionData, usElectionData };
