export const sheets = [
{
  n: 7,
  slug: 'fixed-effects-and-the-ashenfelter-dip',
  title: 'Fixed effects and the Ashenfelter dip',
  lead: 'What a within-unit comparison removes, and why recovery is not impact.',
  related: '<a href="https://doi.org/10.1177/1527002511402155">De Paola and Scoppa (2012)</a>; Wooldridge, <em>Introductory Econometrics</em>, Chapters 13 and 14; Hayashi, <em>Econometrics</em>, Chapter 17.',
  questions: [
    {
      title: 'Sort the variables',
      body: `    <p>For a regression of points on dismissal with team-season fixed effects, state whether each variable is absorbed by the fixed effect, needs separate handling, or should not be included at all: stadium capacity; the identity of the club owner, unchanged all season; the strength of the next opponent; an injury to the first-choice goalkeeper in matchweek 13; the club's average points per match across the previous five seasons; the formation used after the new coach arrives.</p>`,
      answer: `      <ol>
        <li>Stadium capacity: absorbed, since it does not change within a team-season.</li>
        <li>Owner identity, unchanged all season: absorbed, for the same reason.</li>
        <li>Next opponent's strength: needs separate handling. It varies match to match and is a strong cause of points; it may also correlate with dismissal timing if boards act after a bad run against weak opponents.</li>
        <li>Goalkeeper injury in matchweek 13: needs separate handling. It varies within the team-season and can be both a cause of the dismissal decision and of subsequent points.</li>
        <li>Average points over the previous five seasons: absorbed, and in fact collinear with the fixed effect, since it is constant within the team-season.</li>
        <li>Post-dismissal formation: should not be included. It is a mediator, and controlling for it changes the estimand away from the total effect.</li>
      </ol>
      <p>The test for the first column is simply whether the variable varies within a single team's single season. If it does not, the fixed effect has already taken it.</p>`
    },
    {
      title: 'Compute the trap',
      body: `    <p>A club's long-run rate is 1.5 points per match. Over five matches it earns 0.4 per match, dismisses the coach, and then earns 1.4 per match over the following ten. Compute the naive before-and-after change. Then suppose a matched club with an identical slump that did not dismiss recovers to 1.45 per match over its next ten. State the difference-in-differences style estimate and explain, in one sentence, what the naive number actually measured.</p>`,
      answer: `      <p>The naive before-and-after change is 1.4 minus 0.4, which is +1.0 points per match.</p>
      <p>The comparison club's change is 1.45 minus 0.4, which is +1.05. Subtracting gives 1.0 minus 1.05, which is -0.05 points per match, essentially nothing, and if anything slightly negative.</p>
      <p>The naive number measured the reversal of a temporary slump, not the effect of the dismissal. Both clubs returned towards their usual level; the dismissal added nothing detectable.</p>`
    },
    {
      title: 'Explain the dip',
      body: `    <p>Explain the Ashenfelter dip in your own words using the dismissal setting. In particular, say why the dip arises from how treatment is selected rather than from any property of the treatment, and name one non-football setting where the same pattern appears.</p>`,
      answer: `      <p>Boards dismiss coaches after a run of unusually bad results. A run of results contains two components, the club's persistent underlying quality and transient noise from injuries, fixtures, refereeing and luck. A very bad run is disproportionately likely to contain a large negative noise draw, because that is what makes it extreme. Noise, by definition, does not persist, so the following matches tend to come back towards the club's underlying level whatever the board does.</p>
      <p>The dip is a selection phenomenon: it arises because treatment is triggered by an extreme value of a noisy variable that also predicts the outcome. Nothing about sacking a coach causes it, and the same pattern would appear if boards responded to bad runs by repainting the dressing room.</p>
      <p>The original setting is job training: participants enrol after a sharp drop in earnings, and earnings recover partly on their own, so before-and-after comparisons overstate the programme. Medical treatment started at a symptom flare-up is another.</p>`
    },
    {
      title: 'State what remains',
      body: `    <p>An analyst argues that because the model includes team-season fixed effects and matchweek fixed effects, "all confounding is handled". List three specific confounders that survive both sets of fixed effects in the dismissal setting, and say for each why neither fixed effect absorbs it.</p>`,
      answer: `      <p>First, the club's own injury situation. It changes within a team-season, so the team-season effect does not absorb it, and it is club-specific, so the common matchweek effect does not either. It plausibly causes both the dismissal and later points.</p>
      <p>Second, the difficulty of the specific fixtures ahead. Every club faces a different opponent in a given matchweek, so a matchweek effect removes only what is common to all clubs that week. If boards tend to sack before an easier run, the estimate absorbs the schedule.</p>
      <p>Third, the transient form shock itself, which is the Ashenfelter dip. It is a within-team-season deviation and is not common across clubs, so it survives both. This is the important one, because it is the mechanism that generated the treatment.</p>
      <p>A good answer also notes the general point: fixed effects remove what is constant along a dimension, and every confounder here varies along both dimensions at once.</p>`
    },
    {
      title: 'Design the better comparison',
      body: `    <p>Describe a comparison group that addresses the dip directly. Specify what you would match on, how many pre-treatment periods you would inspect, and what pattern in those periods would make you abandon the design.</p>`,
      answer: `      <p>Match dismissing clubs to retaining clubs on the trajectory that triggered the decision, not just on its level: points per match over each of the last five matchweeks separately rather than their average, league position at the decision point, squad strength or wage bill, and the difficulty of the fixtures ahead. Matching within season and division keeps the shared shocks aligned.</p>
      <p>Inspect at least the five matchweeks before the decision, and preferably eight to ten, so that the shape of the dip is visible rather than just its depth. Five is the minimum because the level can be matched while the slope is not.</p>
      <p>Abandon the design if the two groups' pre-treatment paths diverge systematically rather than converging in level, in particular if the dismissing clubs are falling while the comparison clubs are flat, since then the comparison group does not reproduce the shock that triggered treatment and the post-period difference will contain the remainder of that divergence. Also abandon it if no adequate comparison exists for the deepest slumps, which is a positivity failure.</p>`
    },
    {
      title: 'Choose a panel unit',
      body: `    <p>Explain what changes if the fixed effect is specified at club level across ten seasons, rather than at team-season level. Say what extra variation is used, what extra confounding is admitted, and which specification you would choose for the dismissal question.</p>`,
      answer: `      <p>A club fixed effect absorbs only what is constant for the club across a decade: its stadium, its city, its broad institutional character. Anything that changes between seasons, including squad quality, ownership, budget and division, is left in and now contributes variation to the estimate.</p>
      <p>That extra variation means more precision, since comparisons run across seasons as well as within them. It also admits confounding from every between-season change: a club that sacked its coach in a season when it had also sold its best player is now compared with itself in a better-resourced season.</p>
      <p>For the dismissal question, team-season is the right unit. The decision is made within a season, against a fixed squad and a fixed set of expectations, and the confounders of interest are seasonal. The cost, fewer degrees of freedom and wider intervals, is worth paying. A good answer notes that this is a bias-variance choice made on subject-matter grounds, not a statistical test.</p>`
    },
    {
      title: 'Judge a claim',
      body: `    <p>A study reports that with team-season and matchweek fixed effects, the dismissal coefficient is +0.18 points per match with a standard error of 0.05, and concludes that sacking a coach is worth about seven points over a season. Write a critique of at most six sentences covering the estimand, the identification and the uncertainty.</p>`,
      answer: `      <p>The coefficient is identified from within-team-season variation in dismissal timing, so it describes clubs that actually dismissed, in seasons where they did, which is closer to an ATT than to the leaguewide effect the conclusion implies. Identification still requires that, conditional on the two fixed effects and controls, dismissal timing is unrelated to transient form and fixture difficulty, and the Ashenfelter dip is a direct reason to doubt it, so +0.18 is plausibly an upper bound rather than an estimate. The extrapolation to seven points over a season assumes the effect persists at a constant rate for all 38 matches, whereas any bounce is typically concentrated in the first few matches and could reverse. The standard error also needs to allow for serial correlation within teams; if it does not, 0.05 is too small and the interval too narrow. Finally, the estimate averages over versions of dismissal, permanent and interim, which the summary sentence does not mention. The defensible statement is much narrower than the one the study made.</p>`
    }
  ]
},
{
  n: 8,
  slug: 'difference-in-differences',
  title: 'Difference in differences',
  lead: 'Forming the contrast, defending parallel trends and spotting concurrent shocks.',
  related: '<a href="https://doi.org/10.1016/j.joep.2020.102344">Scoppa (2021)</a>; Angrist and Pischke, <em>Mastering Metrics</em>, Chapter 5; Hayashi, Chapter 18.',
  questions: [
    {
      title: 'Compute two estimates',
      body: `    <p>(a) Home yellow cards fall from 2.4 to 2.0 in treated matches and from 2.2 to 2.1 in comparison matches. Compute the difference-in-differences estimate.</p>
    <p>(b) Home win probability falls from 0.46 to 0.38 in closed-door leagues and rises from 0.44 to 0.45 in leagues that kept crowds. Compute the estimate and write one sentence interpreting it in the units of the outcome.</p>`,
      answer: `      <p>(a) The treated change is -0.4. The comparison change is -0.1. The estimate is -0.4 minus -0.1, which is -0.3 yellow cards per home team.</p>
      <p>(b) The treated change is -0.08. The comparison change is +0.01. The estimate is -0.08 minus 0.01, which is -0.09. Playing behind closed doors reduced the home team's probability of winning by about nine percentage points relative to what the comparison leagues' contemporaneous change implies it would otherwise have been.</p>
      <p>The phrase "relative to the comparison group's change" is doing real work in that sentence and should not be dropped.</p>`
    },
    {
      title: 'State the assumption exactly',
      body: `    <p>Write the parallel-trends assumption for the closed-door study as a statement about a potential outcome, not about observed data. Then explain why a table showing that the two groups had similar home-advantage levels before the pandemic is not evidence for it.</p>`,
      answer: `      <p>The assumption is that, had the closed-door leagues not been treated, the average change in their untreated potential outcome from the pre-period to the post-period would have equalled the average change actually observed in the comparison leagues. It is a claim about the treated group's counterfactual path, which nobody observes.</p>
      <p>Similar levels before treatment are neither necessary nor sufficient. Difference in differences explicitly permits the two groups to sit at different levels; that is what taking differences removes. What it does not permit is different trends. Two groups can be at identical levels for years and then diverge, and two groups at very different levels can move perfectly in parallel. The relevant table shows changes over several pre-periods, not a single level comparison.</p>`
    },
    {
      title: 'Find the concurrent shock',
      body: `    <p>Name three changes that could plausibly have affected the closed-door leagues differently from the comparison leagues during the same window. For each, state whether it biases the home-advantage estimate upwards or downwards and why the sign is or is not predictable.</p>`,
      answer: `      <p>First, a change in the permitted number of substitutions adopted by some leagues and not others. More substitutions favour deeper squads and change late-match fatigue; the sign for home advantage is not predictable without knowing whether home or away teams benefit more, so this one is genuinely ambiguous.</p>
      <p>Second, fixture congestion from compressed restarts, which differed by league. Congestion plausibly hurts the team with less squad depth and shortens preparation. Because travel burdens fall mainly on away teams, congestion could partly offset the loss of crowd advantage, biasing the estimated closed-door effect towards zero.</p>
      <p>Third, differences in whether matches moved to neutral venues. A neutral venue removes home advantage entirely, so if treated leagues used more neutral venues, the estimate overstates the effect of crowd absence specifically, since it bundles venue change with crowd removal.</p>
      <p>The general point is that the sign is predictable only when the mechanism is understood well enough to say which side of the fixture it acts on. Simply naming a shock without a direction argument is not a complete answer.</p>`
    },
    {
      title: 'Read a pre-trend plot',
      body: `    <p>An analyst reports pre-period differences between treated and comparison groups of -0.02, 0.01, -0.03 and 0.02 across four pre-periods, none individually significant, and concludes that parallel trends holds. Give two reasons this conclusion is too strong, and describe what additional evidence would strengthen the design.</p>`,
      answer: `      <p>First, the test may simply lack power. Four noisy pre-period differences with wide intervals can be consistent with a substantial trend difference as well as with none, and failing to reject a null is not evidence for it. The relevant question is what magnitude of pre-trend the data could have detected.</p>
      <p>Second, parallel pre-trends do not imply parallel counterfactual post-trends. The threat is a shock that arrives at the same time as treatment, and by construction no pre-period can reveal it. A pandemic that closes stadiums also changes travel, health and scheduling, and none of that is visible before it happens.</p>
      <p>Stronger evidence: a subject-matter argument that the treated and comparison leagues faced comparable non-crowd changes; a triple difference using an outcome that should not respond to crowds; multiple comparison groups with results that agree; a placebo outcome; and, where treatment varied in timing across leagues, an event-study path that shows the effect turning on precisely when crowds went.</p>`
    },
    {
      title: 'Detect composition change',
      body: `    <p>Suppose that during the closed-door period, leagues also rearranged fixtures so that a higher share of matches involved mid-table clubs with nothing to play for. Explain how this threatens the design even if parallel trends holds for any fixed set of matches, and describe how you would check it.</p>`,
      answer: `      <p>Difference in differences compares group averages across periods, and an average can move because the units changed rather than because the outcome changed. If the mix of matches shifts towards fixtures with lower stakes, and stakes affect home advantage, the treated group's post-period average reflects a different population from its pre-period average. Parallel trends can hold for every individual match type while the aggregate comparison is still wrong.</p>
      <p>To check it, tabulate the observable composition of matches by period and group: distribution of home and away league positions, stakes measures such as distance from relegation or European places, share of derbies, share of midweek fixtures, and share of matches involving each club. If the composition shifts, reweight the post-period to the pre-period composition, or move to a within-fixture design that compares the same pairing across seasons, or add match-level covariates and report both adjusted and unadjusted estimates.</p>`
    },
    {
      title: 'Get the standard errors right',
      body: `    <p>The closed-door study uses match-level observations from five countries over ten seasons, with treatment assigned at the league-period level. An analyst clusters standard errors at match level. Explain what is wrong, say what the correct level is, and name the difficulty that arises from that choice.</p>`,
      answer: `      <p>Clustering at match level treats every match as an independent draw, but treatment does not vary across matches within a league-period. Matches within a league share the same policy, the same schedule and the same shocks, so their errors are correlated, and the reported standard error will be far too small.</p>
      <p>The correct level is the level of treatment assignment, which is the league, or league-season depending on how treatment is defined. Serial correlation across periods within a league is a further reason to cluster on the league rather than on the league-period.</p>
      <p>The difficulty is that this leaves five clusters. Cluster-robust standard errors are unreliable with so few, and the usual asymptotic approximation fails. Responses include wild cluster bootstrap with the appropriate small-sample corrections, randomisation inference over the possible assignments, or aggregating the data to league-period means and being explicit that inference rests on five units. What is not acceptable is choosing match-level clustering because it gives a narrow interval.</p>`
    },
    {
      title: 'Design one yourself',
      body: `    <p>In 2023 one national league introduced a mandatory winter break of two weeks while neighbouring leagues did not. You want the effect on player injuries in the second half of the season. Specify the treated and comparison groups, the pre and post periods, the outcome, the main threat to parallel trends, and one placebo test.</p>`,
      answer: `      <p>Treated group: clubs in the league that introduced the break. Comparison group: clubs in neighbouring leagues of similar standard that did not, ideally chosen for similar calendars, climates and squad sizes. Pre-period: several seasons before 2023, using more than one so a trend is visible. Post-period: the seasons from 2023 onwards, with the outcome measured over the second half of each season only, since that is the window the break should affect.</p>
      <p>Outcome: time-loss injuries per 1,000 player-hours of exposure in the second half of the season, which normalises for differences in minutes played.</p>
      <p>Main threat: a league that adopts a winter break is likely to have done so in response to something, such as a rise in injuries or a change in fixture congestion, which makes the adoption endogenous and means the treated league's trend was already diverging. A related threat is that the break shifts fixtures elsewhere in the calendar, so congestion changes in the treated league for reasons other than rest.</p>
      <p>Placebo test: run the same design on an outcome that the break should not affect, such as disciplinary cards or attendance, or run it on the first half of the season, which precedes the break each year. A significant estimate there indicates that the design is picking up general league differences rather than the break.</p>`
    }
  ]
},
{
  n: 9,
  slug: 'event-studies-and-staggered-timing',
  title: 'Event studies and staggered timing',
  lead: 'Reading leads and lags, and why already-treated units make poor controls.',
  related: '<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8411384/">Breidenbach and Mitze (2022)</a>; Wooldridge, Chapters 13 and 14; Hayashi, Chapters 17 and 18.',
  questions: [
    {
      title: 'Read a coefficient path',
      body: `    <p>With week -1 as the reference, an event study reports: week -4, 0.02; week -3, 0.01; week -2, 0.03; week 0, 0.11; week +1, 0.26; week +2, 0.09; week +3, 0.02. Describe what this path says about the effect of hosting, state what the reference period means for how every number should be read, and name the one feature you would want an interval around before believing it.</p>`,
      answer: `      <p>The leads are small and show no drift, which is compatible with the treated and comparison districts moving together before hosting. The effect appears in the hosting week, peaks one week later at 0.26, and decays to near nothing by week +3. That timing is biologically plausible for an infection outcome, which strengthens the reading.</p>
      <p>Every coefficient is a difference relative to week -1, not an absolute level. If week -1 happened to be unusual, the whole path shifts. This is why the choice of reference period is a substantive decision and why some analysts prefer to average several pre-periods as the baseline.</p>
      <p>The feature to see an interval around is the week +1 peak. A single large coefficient in a path of small ones is exactly the pattern that noise produces, and the persuasiveness of the whole path depends on whether that peak is estimated precisely enough to be distinguished from the neighbouring weeks.</p>`
    },
    {
      title: 'Diagnose a drifting lead',
      body: `    <p>Leads rise steadily: -0.01 at week -4, 0.04 at week -3, 0.09 at week -2, with week -1 omitted, and lags continue rising after treatment. Explain the two distinct problems this pattern could indicate, say why the post-treatment coefficients cannot be trusted, and give one design response to each problem.</p>`,
      answer: `      <p>The first possibility is anticipation: units changed behaviour before treatment because they knew it was coming. Districts expecting to host matches may have relaxed restrictions or seen movement increase in advance. The second is a pre-existing differential trend, meaning the treated and comparison groups were already separating for reasons unrelated to treatment, so the design's core assumption fails.</p>
      <p>Either way, the post-treatment coefficients cannot be trusted, because they are measured relative to week -1 and would have continued rising even with no treatment. The lags extrapolate the pre-existing slope, and there is no way to tell from the path itself how much of the post-treatment rise is treatment.</p>
      <p>For anticipation, move time zero earlier to the point at which units first learn treatment is coming, so the anticipation window sits inside the post-period rather than contaminating the leads. For a differential trend, the response is a better comparison group, matched on pre-treatment trajectory, or a design that does not rely on the parallel path, such as a discontinuity or an instrument. Fitting unit-specific linear trends is a third option, but it is fragile, since it can absorb a genuine treatment effect that ramps up.</p>`
    },
    {
      title: 'Rule out a control',
      body: `    <p>District A hosts in week 4, District B hosts in week 8, and the effect of hosting lasts about six weeks. State whether A can serve as a comparison unit for B in week 7, and in week 12. Explain the general rule, and explain why the contamination biases the estimate in a particular direction when effects are positive and persistent.</p>`,
      answer: `      <p>In week 7, no. A is three weeks past its own treatment and, with a six-week effect, is still affected, so it is not an untreated comparison. In week 12, A is eight weeks past treatment and the effect has expired, so it is admissible again, provided nothing else has changed and the effect really does end.</p>
      <p>The general rule is that a valid comparison unit must be untreated at the moment it is used, which in practice means not yet treated, or never treated.</p>
      <p>When effects are positive and persistent, the already-treated comparison has an elevated outcome. Subtracting an elevated comparison from the treated unit's outcome makes the estimated effect for the later cohort too small, and if the contamination is severe enough the aggregate coefficient can fall below every underlying cohort effect. This is the mechanism behind the negative weighting problem in two-way fixed effects.</p>`
    },
    {
      title: 'Explain the negative weights',
      body: `    <p>In two or three sentences, explain why a conventional two-way fixed-effects regression can return an aggregate coefficient that lies outside the range of every cohort-specific effect, and name what an analyst should report instead.</p>`,
      answer: `      <p>The two-way fixed-effects coefficient is a weighted average over many two-by-two comparisons, and some of those comparisons use early-treated units as controls for late-treated ones. When treatment effects change over time, those comparisons subtract a treated outcome rather than an untreated one, so they enter the average with negative weights, and a negatively weighted average can lie outside the range of the quantities being averaged.</p>
      <p>The analyst should estimate effects separately for each treatment cohort at each calendar period, using only not-yet-treated or never-treated units as controls, and then aggregate them with stated, transparent weights, reporting both the aggregate and the cohort paths so the reader can see what is being averaged.</p>`
    },
    {
      title: 'Choose an aggregation',
      body: `    <p>Cohort-specific effects at event time +1 are: cohort A, 0.30, based on 20 districts; cohort B, 0.10, based on 15 districts; cohort C, -0.05, based on 6 districts. Compute a sample-size-weighted average. Then give one reason a reader might prefer to see the three numbers rather than the average, and one situation in which the average is genuinely the quantity of interest.</p>`,
      answer: `      <p>The weighted average is (20 x 0.30 + 15 x 0.10 + 6 x -0.05) divided by 41, which is (6.0 + 1.5 - 0.3)/41 = 7.2/41, about 0.176.</p>
      <p>A reader might prefer the three numbers because they are not estimating the same thing. Cohorts treated at different calendar times faced different conditions, and the spread from 0.30 to -0.05 suggests the effect depends on when hosting occurred, perhaps on the prevailing infection level. An average conceals that dependence and invites the reader to apply 0.176 to a period where it never held.</p>
      <p>The average is the right quantity when the question is about the total burden actually produced across the whole treated population, for example when calculating how many additional cases hosting caused in aggregate. Then the sample-size weighting matches the policy question, and the heterogeneity, while worth reporting, is not what is being asked.</p>`
    },
    {
      title: 'Handle a never-treated group',
      body: `    <p>Twelve districts never hosted a match at any point. Explain the advantage of using them as the comparison group and the risk. Then say what you would check before relying on them.</p>`,
      answer: `      <p>The advantage is clean identification: never-treated districts are untreated at every calendar period, so every comparison is between a treated unit and a genuinely untreated one, and the negative weighting problem disappears. They also make the event-time path easy to interpret, because the same comparison group supports every lag.</p>
      <p>The risk is selection. Districts that never hosted a professional match are systematically different: smaller, more rural, without a professional club, and quite likely different in population density and mobility, which are direct causes of the outcome. Their trend need not be the treated districts' counterfactual trend.</p>
      <p>Before relying on them I would compare pre-treatment levels and, more importantly, pre-treatment trajectories against the treated districts; check whether they are comparable on the covariates that plausibly drive the outcome; and run the analysis both ways, once with never-treated and once with not-yet-treated controls. If the two agree, confidence rises. If they disagree, the disagreement is the finding, and it should be reported rather than resolved by choosing the more convenient one.</p>`
    },
    {
      title: 'Specify a study',
      body: `    <p>Twenty clubs installed a new pitch surface, at different dates over four seasons, and you want the effect on muscle injuries. Specify the event-time window you would estimate, the reference period, the comparison group, and one anticipation concern specific to this setting.</p>`,
      answer: `      <p>Window: I would estimate roughly four to six periods either side, with periods defined in months or half-seasons rather than matches, so that a slow-developing injury outcome has room to appear. A wide enough post-window matters because surface effects may accumulate; a wide enough pre-window is needed to see a trend rather than a point.</p>
      <p>Reference period: the period immediately before installation, or better, an average of two or three pre-periods, since a single reference period on a noisy injury count is unstable. State the choice explicitly.</p>
      <p>Comparison group: clubs not yet resurfaced at each calendar period, plus any that never resurfaced during the window, with cohort-specific estimates aggregated transparently rather than a single two-way fixed-effects coefficient.</p>
      <p>Anticipation concern: clubs usually decide to resurface because the existing pitch has deteriorated, and a deteriorating pitch plausibly raises injuries in the months before installation. That produces rising leads which are not anticipation in the behavioural sense but reverse causation from the outcome to the treatment date, and it is the single most serious threat here. A design response is to define time zero at the decision or contract date rather than at installation, and to report the leads prominently.</p>`
    }
  ]
},
{
  n: 10,
  slug: 'regression-discontinuity',
  title: 'Regression discontinuity',
  lead: 'Running variables, cut-offs, continuity, manipulation and what "local" costs you.',
  related: '<a href="https://eprints.lse.ac.uk/113344/1/1527002521989393.pdf">Reilly and Witt (2021)</a>; <a href="https://doi.org/10.1016/j.serev.2022.100003">Speer (2023)</a>; Angrist and Pischke, Chapter 4; Hayashi, Chapter 21.',
  questions: [
    {
      title: 'Name the parts',
      body: `    <p>For a study of the effect of relegation from a top division on a club's revenue two seasons later, name the treatment, the running variable, the cut-off, whether the design is sharp or fuzzy, and the population the estimate describes. Then state one reason the running variable is harder to define here than in a typical test-score example.</p>`,
      answer: `      <p>Treatment: relegation. Running variable: the club's final league standing expressed as points, or more precisely its distance from the last safe position under the competition's exact ranking rule. Cut-off: the boundary between the lowest safe position and the highest relegated one. The design is sharp, because relegation follows deterministically from final standing. Population: clubs finishing very close to the relegation boundary.</p>
      <p>The running variable is harder to define because league standing is not a single number. Ties are broken by goal difference, then goals scored, then head-to-head results, so two clubs on equal points can be on opposite sides of the cut-off. The running variable must be constructed to respect the actual tie-break rule, which usually means computing a signed distance to the threshold under the full ranking, rather than using raw points. Points are also discrete and coarse, which limits how close to the boundary the data can get.</p>`
    },
    {
      title: 'Compute and interpret',
      body: `    <p>Fitted values approaching the promotion cut-off from above give next-season revenue of 18.2 million pounds; from below, 13.7 million. State the estimate, and write two sentences on what is included in it. Then say why the estimate should not be described as "the effect of promotion on revenue for a typical second-division club".</p>`,
      answer: `      <p>The estimate is 4.5 million pounds.</p>
      <p>It is the total effect of crossing the threshold, which bundles every consequence of promotion: broadcast distributions, higher attendance and ticket prices, sponsorship uplift, prize money, and any change in player trading that follows. Nothing separates those channels, and nothing should be added to the 4.5 million as though it were only the broadcast component.</p>
      <p>It should not be called the effect for a typical club because it is identified only at the margin. Clubs finishing near the promotion boundary are a particular kind of club, and a mid-table or bottom club would not experience the same jump, since revenue gains scale with existing support and commercial base. Extending the number away from the cut-off requires an extrapolation assumption that the design does not supply.</p>`
    },
    {
      title: 'Test for manipulation',
      body: `    <p>A referee worries that clubs manipulate their final position. Explain what precise manipulation would have to mean here for the design to fail, describe the standard diagnostic, and explain why the fact that clubs try very hard to avoid relegation does not by itself break the design.</p>`,
      answer: `      <p>For the design to fail, clubs would have to control their final position precisely enough to land on the favourable side of the threshold, and to do so in a way related to their potential outcomes. Effort alone is not enough; the club would need to be able to guarantee finishing seventeenth rather than eighteenth.</p>
      <p>The standard diagnostic is a density test on the running variable: if units sort, the density of the running variable jumps at the cut-off, with an excess just above and a deficit just below. Alongside it, one checks whether predetermined characteristics, such as wage bill or previous-season position, jump at the threshold, since sorting on the outcome usually shows up as sorting on its causes.</p>
      <p>Strenuous effort does not break the design because final standing depends on other teams' results, refereeing, injuries and the residual randomness of matches. What matters is control of the realised value near the boundary, and that control is very imperfect: a club can raise its expected points but cannot choose to finish exactly one point clear. The concern becomes real in specific circumstances, such as the final matchday when both the club and its opponent know the standings and one has nothing to play for.</p>`
    },
    {
      title: 'Choose a bandwidth',
      body: `    <p>An analyst reports estimates of 4.1 million at a bandwidth of 3 points, 4.5 million at 6 points, 5.9 million at 12 points and 7.4 million at 20 points, with intervals narrowing as the bandwidth widens. Explain the trade-off this table displays, say which estimate you would headline, and state what pattern in such a table would worry you.</p>`,
      answer: `      <p>Narrow bandwidths use only units very close to the cut-off, where the continuity assumption is most credible and the functional form matters least, but they use few observations, so the interval is wide. Wide bandwidths add data and precision, but they include units far from the threshold whose comparability rests on the fitted trend being correct. The rising estimates here are the signature of that: as the window widens, the estimate is increasingly driven by the extrapolated slope.</p>
      <p>I would headline the estimate at or near the smallest bandwidth that still gives usable precision, so 4.1 or 4.5 million, and report the whole table. The 7.4 million figure at 20 points is not a regression discontinuity estimate in any meaningful sense; at that width the design is effectively a regression on a large sample of dissimilar clubs.</p>
      <p>The worrying pattern is exactly this one, a steady monotone drift with bandwidth, which suggests the fitted trend is misspecified or that the two sides differ systematically away from the cut-off. A reassuring table shows estimates that are flat across a range of bandwidths and move only in the very widest windows.</p>`
    },
    {
      title: 'Find a coincident treatment',
      body: `    <p>Reilly and Witt exploit the split of the Scottish Premiership after the sixth and seventh positions. Explain what a coincident treatment at that threshold would be, give one concrete example, and say why this threat is more serious in football than in many other regression discontinuity settings.</p>`,
      answer: `      <p>A coincident treatment is another cause of the outcome that changes at the same cut-off. The design attributes the whole jump to the treatment of interest, so anything else that switches on at the same point is inseparable from it.</p>
      <p>A concrete example: the position that determines the league split may also determine European qualification, or prize-money bands, or the number of home fixtures in the remaining schedule. If the split boundary coincides with a change in the number of home matches, then attendance jumps for a reason that has nothing to do with the split itself.</p>
      <p>The threat is worse in football because league rules are written to attach many consequences to the same rank boundaries. Qualification, prize money, fixture allocation and broadcast selection are all keyed to final standing, so a single threshold routinely carries several treatments at once. In a setting where a threshold is set by an administrative rule for one purpose, coincident treatment is unusual; here it should be assumed until ruled out, by reading the competition regulations carefully and stating what else changes at the cut-off.</p>`
    },
    {
      title: 'Run the falsification battery',
      body: `    <p>List four falsification checks you would require in a regression discontinuity paper on relegation and revenue, and for each say what result would count as a failure.</p>`,
      answer: `      <ol>
        <li>Density of the running variable at the cut-off. Failure: a visible jump, with more clubs just above the safe line than just below, indicating sorting.</li>
        <li>Continuity of predetermined covariates, such as previous-season wage bill, stadium capacity and attendance. Failure: a significant discontinuity in any strong predictor of revenue at the true cut-off, which means the two sides differ for reasons other than treatment.</li>
        <li>Placebo cut-offs at points where nothing changes, for instance between the tenth and eleventh positions. Failure: estimates of similar magnitude at fake thresholds, which indicates the method manufactures jumps.</li>
        <li>Sensitivity to bandwidth and to polynomial order, including a check that high-order global polynomials are not driving the result. Failure: an estimate that changes sign or magnitude materially across reasonable specifications.</li>
      </ol>
      <p>A fifth worth adding is a donut specification that drops observations immediately at the threshold, which tests whether the result depends on the units most susceptible to manipulation or to measurement error in the running variable.</p>`
    },
    {
      title: 'Decide whether the design applies',
      body: `    <p>A club asks whether giving a player his professional debut before the age of 19 affects his career appearance total. Someone proposes a regression discontinuity at age 19. Say whether this is a valid design, and explain your reasoning in terms of the running variable and the assignment rule. If it is not valid, name a design from this course that fits better.</p>`,
      answer: `      <p>It is not a valid design. Regression discontinuity requires that treatment be determined by the running variable through a rule at the cut-off. Here age does not determine whether a player debuts; a coach does. Nothing changes discontinuously at 19, so there is no jump in treatment probability to exploit, and any jump in the outcome at 19 would reflect the coach's selection rather than a rule.</p>
      <p>The proposal also confuses the treatment with a characteristic of the treated. Debuting before 19 is partly a measure of how good the player already was, which is precisely the confounding the design is supposed to remove.</p>
      <p>A better fit depends on what rule-like variation exists. If a competition imposes a minimum age or a squad quota for under-19 players, that rule can serve as an instrument for early debut, giving a local average treatment effect for players whose debut timing responds to it, which is Lesson 11. Failing that, a target trial emulation with matched comparison on ability at each decision point, as in Lessons 4 and 5, is the honest observational route.</p>`
    }
  ]
},
{
  n: 11,
  slug: 'instrumental-variables-and-late',
  title: 'Instrumental variables and the LATE',
  lead: 'Relevance, independence, exclusion, monotonicity, and who the estimate is about.',
  related: '<a href="https://doi.org/10.1287/mnsc.2021.03356">Glennon et al. (2025)</a>; Hernan and Robins, Chapter 16; Angrist and Pischke, Chapter 3; Ruiz de Villa, Chapter 9.',
  questions: [
    {
      title: 'Compute two Wald estimates',
      body: `    <p>(a) A policy increases the probability of starting an academy player by 0.20 and increases win probability by 0.03. Compute the Wald estimate and state its units.</p>
    <p>(b) Easing a foreign-player restriction raises the number of immigrant starters by 0.8 per match and raises average goal difference by 0.12. Compute the estimate. Then suppose a second league's easing raises immigrant starters by only 0.05 and goal difference by 0.02. Compute that estimate and comment.</p>`,
      answer: `      <p>(a) 0.03 divided by 0.20 is 0.15. Starting an academy player raises win probability by 15 percentage points, for clubs whose selection responds to the policy.</p>
      <p>(b) 0.12 divided by 0.8 is 0.15 goals per additional immigrant starter. The second league gives 0.02 divided by 0.05, which is 0.40 goals per starter.</p>
      <p>The second estimate should not be taken at face value. A first stage of 0.05 is very weak, so the denominator is small and imprecisely estimated, and dividing by it inflates both the point estimate and its sampling variability enormously. Weak instruments also bias the estimate towards the ordinary least squares value and make conventional intervals badly wrong. A first stage that small is a reason to report the reduced form and abandon the ratio, not to report 0.40.</p>`
    },
    {
      title: 'Assign each condition to its evidence',
      body: `    <p>For each of relevance, independence, exclusion and monotonicity, state whether it can be assessed from the data, argued from institutional knowledge, or partially both. Then explain why a first-stage F statistic of 300 tells you nothing about three of the four.</p>`,
      answer: `      <p>Relevance is testable in the data: regress treatment on the instrument and controls, and inspect the strength of the association. Independence is largely an institutional argument, though it can be partially probed by checking that the instrument is unrelated to predetermined covariates. Exclusion is not testable at all in the just-identified case and must be argued from knowledge of the policy; with more instruments than endogenous variables, an overidentification test provides weak indirect evidence. Monotonicity is not directly testable either, although some implications, such as non-negative first stages within every subgroup, can be checked.</p>
      <p>An F statistic of 300 says only that the policy moved the treatment a great deal. It says nothing about whether the policy was introduced for reasons related to expected performance, nothing about whether it affects performance through channels other than the treatment, and nothing about whether it pushed some clubs in the opposite direction. A powerful instrument that violates exclusion produces a precisely estimated wrong answer, which is worse than an imprecise one.</p>`
    },
    {
      title: 'Attack the exclusion restriction',
      body: `    <p>Foreign-player restrictions are used as an instrument for the number of immigrant starters, with performance as the outcome. Name three distinct channels through which the restriction could affect performance other than through the number of immigrant starters, and for each say whether redefining the treatment would rescue the design.</p>`,
      answer: `      <p>First, transfer market prices. A restriction changes demand for domestic players, so their fees and wages move, which changes what every club can afford across the whole squad. Redefining the treatment as, say, total squad quality would absorb this channel, but that treatment is far harder to measure and the estimate then answers a different question.</p>
      <p>Second, youth development. A binding restriction gives clubs an incentive to invest in academies, and that investment affects performance over subsequent seasons through players who are not immigrant starters. Redefinition does not rescue this easily, because the channel operates on a longer timescale than the treatment and would require a treatment defined as the whole roster-composition strategy.</p>
      <p>Third, squad composition beyond the starting eleven. The restriction changes who is available on the bench and in rotation, which affects results through fatigue management and injury cover. Redefining the treatment as immigrant players in the squad rather than in the starting line-up would capture much of this, and is the most rescuable of the three.</p>
      <p>The general lesson is that a policy instrument tends to violate exclusion for a narrow treatment definition and satisfy it for a broad one, at the price of a vaguer estimand. Choosing between them is a substantive decision, not a technical one.</p>`
    },
    {
      title: 'Describe the compliers',
      body: `    <p>Describe, in football terms, which clubs the LATE from the foreign-player restriction is about. Then name the two other groups the estimate says nothing about, and explain why the LATE could be much larger or smaller than the ATE.</p>`,
      answer: `      <p>The compliers are clubs whose use of immigrant starters actually changed because the restriction changed: clubs at the margin, who wanted more immigrant players than the old rule allowed but not so many that they were unaffected by the new limit. In practice these are likely to be mid-table clubs with international scouting but limited budgets.</p>
      <p>The estimate says nothing about always-takers, clubs that field many immigrant starters regardless because they operate at the top of the market and can sign whoever they wish, and nothing about never-takers, clubs that field few regardless because of a domestic recruitment model, financial constraint or club policy.</p>
      <p>The LATE can differ sharply from the ATE because these groups are not alike. If the marginal immigrant signing for a mid-table club is a clear upgrade on the domestic alternative, the complier effect is large, while a top club's marginal immigrant signing displaces an already excellent domestic player and would show a much smaller effect. That is a reason to expect the LATE to exceed the ATE here, and it is why the population served by the estimate must be described rather than left implicit.</p>`
    },
    {
      title: 'Break monotonicity',
      body: `    <p>Construct a plausible story in which easing a foreign-player restriction causes some clubs to use fewer immigrant starters. Explain what this does to the interpretation of the ratio estimate.</p>`,
      answer: `      <p>Suppose the easing applies league-wide. A club with a strong academy may find that rival clubs immediately sign the best available foreign players, which raises the market price of foreign talent beyond that club's reach, while simultaneously making domestic players cheaper as demand for them falls. That club responds to the easing by shifting towards domestic players, so it uses fewer immigrant starters after a policy that permits more.</p>
      <p>Such clubs are defiers. With defiers present, the Wald ratio is no longer a weighted average of complier effects; it becomes a difference between complier and defier contributions in the numerator, divided by a net first stage in the denominator. The estimate can lie outside the range of every individual causal effect in the population, and the reassuring interpretation as "the effect for units that responded" is simply unavailable.</p>
      <p>Note that the story depends on general equilibrium effects, one club's response changing another's environment, which is also an interference problem. Monotonicity is most at risk exactly where instruments act through markets rather than on isolated units.</p>`
    },
    {
      title: 'Correct a procedure',
      body: `    <p>An analyst runs the first stage, saves the fitted values, puts them into a second regression, and reports the standard errors from that second regression. Explain what is wrong, and separately explain why adding a control variable to the second stage but not the first is also an error.</p>`,
      answer: `      <p>The second regression's standard errors treat the fitted values as though they were known data, when they are estimates carrying their own sampling uncertainty. The reported standard errors are therefore too small. Two-stage least squares software computes the correct combined variance; manual substitution does not. The point estimate from the manual procedure is right, which is what makes the error easy to miss.</p>
      <p>Omitting a control from the first stage while including it in the second breaks the logic of the procedure. The instrument's validity is conditional on the controls, so the first stage must isolate the variation in treatment that is driven by the instrument given those controls. If a control appears only in the second stage, the fitted values contain variation correlated with it, and the exclusion argument no longer applies to the variation actually being used. Every exogenous control belongs in both stages.</p>`
    },
    {
      title: 'Propose and then reject an instrument',
      body: `    <p>You want the effect of a manager's tactical experience in European competition on domestic results. Propose an instrument, then argue against your own proposal on each of relevance, independence and exclusion, and say what you would conclude.</p>`,
      answer: `      <p>Proposal: whether the club qualified for a European competition in the previous season, on the grounds that qualification exposes the manager to more European fixtures and so builds experience.</p>
      <p>Relevance is the strongest part of the case, since qualification mechanically increases European matches, though it is weakened by managers changing clubs and by experience accumulated elsewhere. Independence fails badly: qualification is earned by finishing high, so it is determined by exactly the club quality that also drives next season's domestic results. Conditioning on previous-season points helps but is unlikely to be enough, since qualification is a discontinuous function of the same variable. Exclusion fails too: European qualification brings revenue, squad expansion, prestige in recruitment and also fixture congestion and travel, each of which affects domestic results without passing through the manager's experience at all.</p>
      <p>The conclusion is that this instrument should be abandoned. Its most promising feature, the sharp qualification boundary, points to a different design: a regression discontinuity at the qualification cut-off, estimating the effect of qualifying itself rather than of managerial experience. That is a narrower question but an identifiable one, and choosing the answerable question over the desired one is often the right move.</p>`
    }
  ]
},
{
  n: 12,
  slug: 'synthetic-control',
  title: 'Synthetic control',
  lead: 'Donor pools, weights, pre-treatment fit and placebo inference.',
  related: '<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8411384/">Breidenbach and Mitze (2022)</a>; <a href="https://eml.berkeley.edu/~saez/kleven-landais-saezMay12football.pdf">Kleven, Landais and Saez (2013)</a>; Ruiz de Villa, Section 11.3.',
  questions: [
    {
      title: 'Compute a gap',
      body: `    <p>A treated district's synthetic control uses donors with weights 0.50, 0.30 and 0.20 and weekly infection rates of 10, 14 and 8 per 100,000. Compute the synthetic rate. The treated district's rate is 15. State the gap. Then state the one piece of information you would need before interpreting that gap as an effect.</p>`,
      answer: `      <p>The synthetic rate is 0.50 x 10 + 0.30 x 14 + 0.20 x 8 = 5 + 4.2 + 1.6 = 10.8 per 100,000. The gap is 15 minus 10.8, which is 4.2 per 100,000.</p>
      <p>The information needed is the pre-treatment fit: how closely this weighted combination tracked the treated district's actual infection rate in the weeks before hosting resumed. If the synthetic control was already two or three units away from the treated district before treatment, a post-treatment gap of 4.2 means very little, since the construction never reproduced the unit in the first place. The gap is interpretable only relative to the size of the pre-treatment discrepancy.</p>`
    },
    {
      title: 'Screen the donor pool',
      body: `    <p>You are building a synthetic control for a district that hosted matches. Decide whether each candidate donor belongs in the pool and why: a neighbouring district whose residents attended the matches; a district that hosted matches six weeks later; a district in a different country with a comparable population; a district with no professional club and a very different age profile.</p>`,
      answer: `      <ol>
        <li>The neighbouring district whose residents attended: exclude, or model explicitly. It is indirectly treated through spillover, so its outcome is not an untreated trajectory. Including it drags the synthetic control towards the treated path and biases the gap towards zero.</li>
        <li>The district that hosted six weeks later: it may be used for the first six weeks but must be dropped or censored once it is treated. Many implementations simply exclude later-treated units to keep the counterfactual clean over the whole window.</li>
        <li>The district in another country: usually exclude. Even with a similar population, it faces different national policy, testing regimes and reporting definitions, so its outcome series is not comparable. If included, one must argue that the outcome is measured the same way.</li>
        <li>The district with no professional club and a different age profile: include it in the pool. Having no club is not disqualifying, since we need untreated units, and the method itself will assign it a low weight if it does not help reproduce the treated pre-treatment path. Screening donors on outcomes is a mistake; screening them on treatment exposure is not.</li>
      </ol>`
    },
    {
      title: 'Interpret the weights',
      body: `    <p>A synthetic control assigns weight 0.82 to a single donor and small weights to two others. Say what this tells you about the donor pool, name the diagnostic you would run, and describe what result would make you abandon the estimate.</p>`,
      answer: `      <p>It tells you that one donor does almost all the work, so the estimate is close to a two-unit comparison rather than a genuinely synthetic one. The pool may lack units resembling the treated district, or the treated district may be extreme on the predictors, either of which undermines the premise that a convex combination of donors can reproduce it.</p>
      <p>The diagnostic is a leave-one-out analysis: rebuild the synthetic control with the dominant donor excluded and see whether the estimated gap survives in size and sign. Reporting the whole family of leave-one-out paths is standard.</p>
      <p>I would abandon the estimate if removing that donor collapses the pre-treatment fit or reverses the gap, since that means the result is a statement about one particular district rather than about the treatment. I would also be wary if the dominant donor is one with a known idiosyncratic shock in the post-period, since the gap would then measure that shock rather than the intervention.</p>`
    },
    {
      title: 'Run placebo inference',
      body: `    <p>Explain how a placebo-in-space analysis produces something like a p-value without a sampling model. Then explain why the raw post-treatment gaps of the placebo units must not be compared directly with the treated unit's gap, and state the standard correction.</p>`,
      answer: `      <p>The procedure reassigns treatment in turn to each untreated donor, builds a synthetic control for it from the remaining units, and records its post-treatment gap. This produces a distribution of gaps under no treatment. The treated unit's gap is then placed in that distribution, and its rank gives an inference statement of the form: if the treatment had no effect, a gap this large would occur in this fraction of units. That is a randomisation-style argument, resting on the exchangeability of units rather than on an assumed error distribution.</p>
      <p>Raw gaps are not comparable because units differ in how well they could be fitted before treatment. A donor that no combination reproduces will show a large gap in every period, including the post-period, for reasons having nothing to do with treatment. Comparing the treated unit's gap with that unit's gap is comparing an effect with a fitting failure.</p>
      <p>The standard correction is the ratio of post-treatment to pre-treatment root mean squared prediction error. Ranking units on that ratio rewards a unit whose path was reproduced well before treatment and diverged after it, which is the pattern that actually signals an effect. An alternative is to exclude placebo units whose pre-treatment error exceeds some multiple of the treated unit's, stated in advance.</p>`
    },
    {
      title: 'Read a placebo-in-time result',
      body: `    <p>An analyst moves the intervention date back by ten weeks, to a period when nothing happened, refits, and finds a gap about 60 per cent as large as the real one. Say what this implies, and describe two possible causes.</p>`,
      answer: `      <p>It implies the design manufactures gaps without treatment, so the real gap cannot be attributed to the intervention with any confidence. A credible placebo-in-time test returns a gap near zero.</p>
      <p>One possible cause is overfitting on a short pre-treatment window. If the weights are chosen using only a few periods, they can fit noise rather than structure, and the fitted combination then drifts away from the treated unit as soon as the fitting window ends, whether or not treatment occurred. Lengthening the pre-period and holding out part of it for validation addresses this.</p>
      <p>The other is that the treated unit was already on a diverging path, so the gap reflects a trend rather than an intervention. If the treated district's infection dynamics differed structurally from every donor's, the gap grows steadily regardless of the assumed date. Here the remedy is a better donor pool or a different design, not a technical adjustment.</p>`
    },
    {
      title: 'Compare with difference in differences',
      body: `    <p>Give two respects in which synthetic control is more flexible than difference in differences, and one respect in which it is more demanding. Then name a football setting where you would choose synthetic control over difference in differences and say why.</p>`,
      answer: `      <p>First, it does not impose parallel trends across all untreated units; it constructs a weighted combination chosen to match the treated unit's pre-treatment path, which permits time-varying unobserved factors to have unit-specific loadings. Second, it makes the comparison group explicit and quantified, since the weights are reported and can be inspected and argued with, whereas difference in differences implicitly weights all controls equally.</p>
      <p>It is more demanding in data: it requires a long, clean pre-treatment outcome series for the treated unit and every donor, and it works with one treated unit or a few rather than many.</p>
      <p>I would choose it for a single-club or single-league intervention with a long history, such as the effect of a stadium move on attendance for one club, or the effect of a national tax reform on player migration to one country as in Kleven, Landais and Saez. There is exactly one treated unit, no natural set of parallel-trending comparators, and years of pre-treatment data, which is precisely the configuration difference in differences handles badly and synthetic control handles well.</p>`
    },
    {
      title: 'Judge a reported result',
      body: `    <p>A paper reports a treated-minus-synthetic gap of 3.8, a pre-treatment RMSPE of 3.1, a post-treatment RMSPE of 4.0, and states that the treated unit's gap is larger than 34 of 40 placebo units. Write your verdict in no more than five sentences.</p>`,
      answer: `      <p>The pre-treatment fit is poor: an RMSPE of 3.1 is close to the reported gap of 3.8, so the synthetic control never reproduced the treated unit and the post-treatment divergence is barely distinguishable from the fitting error. The ratio of post to pre RMSPE is about 1.3, which is very modest, and it is that ratio, not the raw gap, on which the placebo ranking should have been based. Ranking above 34 of 40 placebos gives a nominal figure of roughly 0.15 even taken at face value, which is not strong, and it is likely overstated if the ranking used raw gaps. My verdict is that the paper has not demonstrated an effect. The right presentation would report the full path, the fit measure prominently, and the ratio-based placebo ranking, and would state that the design is uninformative for this unit.</p>`
    }
  ]
}
];
