export const sheets = [
{
  n: 1,
  slug: 'from-question-to-estimand',
  title: 'Define a causal question and estimand',
  lead: 'Potential outcomes, ATE and ATT, and the identification assumptions.',
  related: 'Hernan and Robins, <em>Causal Inference: What If</em>, Chapters 1 and 3. The dismissal setting comes from <a href="https://doi.org/10.1177/1527002511402155">De Paola and Scoppa (2012)</a>, whose own identification strategy is the subject of <a href="../lessons/0007-fixed-effects-and-the-ashenfelter-dip.html">Lesson 7</a>.',
  questions: [
    {
      title: 'Name the missing quantity',
      body: `    <p>A club sits fourteenth after matchweek 12. It dismisses its head coach and takes seven points from the following five matches. Write down, in one sentence each, what <em>Y(1)</em> and <em>Y(0)</em> are for this club at this decision point, which one is observed, and what number the observed value takes.</p>`,
      answer: `      <p><em>Y(1)</em> is the number of league points the club would take over its next five matches if it dismissed the coach at matchweek 12. <em>Y(0)</em> is the number of points the same club would take over those same five matches, against those same opponents, if it retained the coach instead. Because the board dismissed, <em>Y(1)</em> is observed and equals seven. <em>Y(0)</em> is not observed and never will be.</p>
      <p>The most common error is to describe <em>Y(0)</em> as what some other club did, or as what this club did earlier. <em>Y(0)</em> is defined for this club, at this decision point, over this specific fixture list. That is what makes it unobservable rather than merely unmeasured.</p>`
    },
    {
      title: 'Reject three candidate counterfactuals',
      body: `    <p>An analyst offers three candidates for the missing potential outcome of the club in Question 1. For each, give one specific reason it fails.</p>
    <ol>
      <li>The five points the club took in the five matches before the dismissal.</li>
      <li>The average points taken over the same five matchweeks by the four clubs that kept their coaches.</li>
      <li>The points the club took over the same five matchweeks in the previous season.</li>
    </ol>`,
      answer: `      <ol>
        <li>The earlier five matches were played at a different time, against different opponents, with a different injury list, and they are precisely the run that triggered the dismissal. Using them builds the selection into the comparison, and an unusually poor run tends to be followed by a better one whatever the board does.</li>
        <li>The clubs that kept their coaches are not comparable, because boards dismiss after poor results. Those clubs were on average performing better at matchweek 12, so their subsequent points reflect a stronger starting position rather than the absence of dismissal.</li>
        <li>The previous season involves a different squad, a possibly different league position and different opponents in those matchweeks. The club's underlying quality may also have changed between seasons in ways related to why the coach was under pressure.</li>
      </ol>
      <p>All three failures share a shape. Each candidate differs from the true <em>Y(0)</em> in ways related to the reason for treatment, which is exactly what exchangeability rules out.</p>`
    },
    {
      title: 'Compute an ATE and an ATT',
      body: `    <p>Five clubs are eligible at matchweek 10. Both potential outcomes are shown, which no real dataset would give you.</p>
    <table>
      <thead><tr><th>Club</th><th>Y(1)</th><th>Y(0)</th><th>Decision</th></tr></thead>
      <tbody>
        <tr><td>Harbour City</td><td>9</td><td>4</td><td>Dismiss</td></tr>
        <tr><td>Old Mill FC</td><td>6</td><td>8</td><td>Retain</td></tr>
        <tr><td>Northgate United</td><td>7</td><td>5</td><td>Dismiss</td></tr>
        <tr><td>Vale Rovers</td><td>5</td><td>5</td><td>Retain</td></tr>
        <tr><td>Kings Park</td><td>8</td><td>2</td><td>Dismiss</td></tr>
      </tbody>
    </table>
    <p>Calculate the ATE and the ATT. Then compute the naive difference in observed mean points between the clubs that dismissed and the clubs that retained. Which of the three numbers is largest, and what does the gap between the naive difference and the ATT tell you about how these boards chose?</p>`,
      answer: `      <p>The club-level effects are +5, -2, +2, 0 and +6.</p>
      <p>The ATE is (5 - 2 + 2 + 0 + 6) divided by 5, which is 2.2 points.</p>
      <p>The ATT averages over the three clubs that dismissed, so it is (5 + 2 + 6) divided by 3, which is about 4.33 points.</p>
      <p>The naive comparison uses observed outcomes only. The dismissing clubs are observed at <em>Y(1)</em> and average 8. The retaining clubs are observed at <em>Y(0)</em> and average 6.5. The naive difference is 1.5 points.</p>
      <p>The ATT is the largest of the three. The naive difference understates it by about 2.83 points, because the clubs that dismissed have a much lower <em>Y(0)</em> on average, about 3.67, than the clubs that retained, at 6.5. In this constructed sample the boards dismissed at clubs that would have done badly anyway, and those clubs also happened to benefit most. The naive difference mixes the two facts together and reports neither.</p>`
    },
    {
      title: 'Choose the estimand that matches the decision',
      body: `    <p>Three people want an answer from the same coach-dismissal dataset.</p>
    <ol>
      <li>A league regulator wondering whether to impose a mid-season sacking window on all clubs.</li>
      <li>A board that has just dismissed its coach and wants to know whether it was right.</li>
      <li>A board currently sitting eighteenth and deciding tonight whether to dismiss.</li>
    </ol>
    <p>For each, state whether the ATE, the ATT or neither is the quantity they need, and say why in one sentence. Where you answer neither, name the population you would actually want.</p>`,
      answer: `      <ol>
        <li>The regulator needs the ATE, or something close to it. A rule applied to every club changes the strategy for clubs that would not otherwise have dismissed, so the relevant average runs over all eligible clubs.</li>
        <li>The board that has already dismissed needs the ATT. The question is whether the decision helped clubs like the ones that took it, which is exactly the population the ATT averages over.</li>
        <li>Neither, strictly. This board wants the effect among clubs that are eligible and deciding now, sitting eighteenth, with this form and this squad. That is a conditional effect for a narrower population, sometimes written as a conditional average treatment effect. The ATT is the closer of the two standard estimands, because the decision profile resembles the treated population.</li>
      </ol>`
    },
    {
      title: 'Write two causal questions in full form',
      body: `    <p>Rewrite each of these as a question with a population, two treatment strategies, an outcome and a time horizon, using the form given in the lesson.</p>
    <ol>
      <li>"Does playing on a Monday night hurt attendance?"</li>
      <li>"Does a winter training camp reduce injuries?"</li>
    </ol>`,
      answer: `      <p>Attendance: among top-flight league fixtures that could feasibly be scheduled either way, what is the average effect of scheduling the fixture on a Monday evening rather than on a Saturday afternoon on the number of paying spectators present at that fixture? The time horizon is supplied by the fixture itself, since attendance is measured once. A good answer notices this rather than inventing a follow-up period.</p>
      <p>Training camp: among senior squad players under contract at the winter break and medically cleared to travel, what is the average effect of attending a ten-day warm-weather camp rather than remaining on the club's normal domestic schedule on the number of time-loss injuries recorded over the remaining sixteen league matches?</p>
      <p>A good answer includes a named comparison strategy rather than an implicit "no camp", a specific outcome definition rather than "injuries", and a follow-up window with a stated start. Mark yourself strictly on the comparison strategy, because that is the part most often left blank.</p>`
    },
    {
      title: 'Match the failure to the assumption',
      body: `    <p>Name which identification assumption each situation threatens, and explain the threat in one sentence.</p>
    <ol>
      <li>Half the clubs in the dataset appointed a permanent successor, and half appointed a caretaker from the academy for the rest of the season.</li>
      <li>Every club in the bottom three at matchweek 20 in the sample dismissed its coach.</li>
      <li>Boards dismiss coaches after poor runs, and clubs on poor runs would tend to improve anyway.</li>
      <li>A dismissal is followed by a bounce partly because the next opponent, a rival in the same league, prepares differently for an unfamiliar coach.</li>
    </ol>`,
      answer: `      <ol>
        <li>Consistency. "Dismissal" covers two materially different interventions, so the observed outcome under the label does not correspond to one well defined potential outcome.</li>
        <li>Positivity. Clubs in the bottom three at matchweek 20 are never observed under retention, so the data contain no information about what retention would do for that type of club.</li>
        <li>Exchangeability. The reason for treatment is itself a cause of the later outcome through regression towards the club's usual level, so treated and untreated clubs do not stand in for each other's missing outcomes.</li>
        <li>No relevant interference. One club's treatment changes another club's potential outcome through the fixture list, which is a persistent difficulty in a league where every unit plays every other unit.</li>
      </ol>`
    },
    {
      title: 'Sharpen a vague treatment strategy',
      body: `    <p>An analyst writes the treatment as "the club changes its coach". List three distinct ambiguities in that phrase that would make consistency doubtful, then write one version of the strategy precise enough that two analysts working from the same match records would classify every club identically.</p>`,
      answer: `      <p>Three ambiguities worth naming, from a longer list: whether a mutually agreed departure or a resignation counts as a change; whether the successor is permanent, an interim from within the staff, or an academy caretaker; whether the assistant coaches and fitness staff change too; when the change is deemed to occur, on the announcement, on the last match of the old coach or on the first match of the new one; and whether a change during an international break counts differently from one between two league fixtures.</p>
      <p>A workable precise version: the club announces the departure of the head coach within 48 hours of the final whistle of its matchweek-<em>k</em> fixture, and a named successor, whether permanent or interim, takes charge of the following league fixture. The comparison strategy is that the same head coach takes charge of each of the next five league fixtures.</p>
      <p>The test to apply to your own version is the one in the question. If two analysts with the same match records could disagree about how to classify any club, the strategy is not yet precise enough.</p>`
    },
    {
      title: 'Critique a published claim',
      body: `    <p>A report states: "Across the last ten seasons, clubs that dismissed their head coach mid-season averaged 1.31 points per match afterwards, against 1.28 for clubs that did not. Dismissal therefore has no effect." Write a short critique of no more than six sentences. Say what quantity the report has actually computed, why it is not the ATT, and in which direction you expect the bias to run.</p>`,
      answer: `      <p>The report has computed a difference in observed mean outcomes between two self-selected groups, which is an association, not a causal effect. It is not the ATT because the 1.28 figure comes from clubs that did not dismiss, and those clubs were not on the same trajectory. The clubs that dismissed were, almost by construction, in worse form and probably weaker overall, so their missing <em>Y(0)</em> is lower than the 1.28 the report substitutes for it. That substitution biases the estimate downwards, which means the true ATT is likely more positive than the reported gap of 0.03. The near-zero difference is therefore consistent with a genuinely positive effect that selection has hidden, as well as with a genuinely null one. Distinguishing the two needs a comparison group matched on the form and standing that prompted the dismissal, which is what Lessons 5 and 7 build.</p>
      <p class="answer-note">If you argued the bias runs the other way, check the direction of selection. Dismissal follows bad results, so the treated group's counterfactual is worse than the untreated group's observed outcome, and the naive contrast understates a positive effect.</p>`
    }
  ]
},
{
  n: 2,
  slug: 'cluster-randomisation-and-itt',
  title: 'Cluster randomisation and intention to treat',
  lead: 'Units of assignment, clustering and what an ITT estimate does and does not say.',
  related: '<a href="https://doi.org/10.1016/j.jphys.2017.08.004">Al Attar et al. (2017)</a>; Hernan and Robins, <em>What If</em>, Chapters 2 and 9; Sweet, <em>Experimentation for Engineers</em>, Chapters 1 and 2.',
  questions: [
    {
      title: 'Separate the three units',
      body: `    <p>A national association randomises 24 youth academies to a new hamstring protocol or to usual practice. Within each academy, 40 players are followed, and every training session is logged. For this trial, name the unit of randomisation, the unit of observation and the unit that determines the effective sample size for uncertainty. Then say what happens to precision if the association doubles the players per academy to 80 rather than doubling the academies to 48.</p>`,
      answer: `      <p>The academy is the unit of randomisation, with 24 independent allocations. The player is the unit of observation, with 960 outcome records. Uncertainty is governed by the 24 academies, because players within an academy share coaching, pitches, schedules and load, so their outcomes are correlated.</p>
      <p>Doubling players within academies adds correlated information and improves precision only slightly, with the gain limited by the intraclass correlation. Doubling the number of academies adds independent allocations and improves precision far more. This is the practical reason cluster trials are usually constrained by cluster count rather than by participant count.</p>`
    },
    {
      title: 'Explain the design choice',
      body: `    <p>The FIFA 11+ trial assigned whole teams rather than individual players. Give two distinct reasons why individual randomisation within a team would have been a worse design here, and name one cost the team-level design pays in exchange.</p>`,
      answer: `      <p>First, contamination. Players train together, so control players would see and copy the extra exercises, which pulls the two arms towards each other and biases the estimate towards zero. Second, the intervention is partly a property of the session itself. Adding ten minutes to the end of a shared training session is not something one player can receive while the player beside him does not, so individual assignment would not deliver a coherent treatment at all.</p>
      <p>The cost is precision and balance. With 21 clusters the trial has few independent allocations, so chance imbalance between arms is more likely and the standard errors are wider than a player-randomised trial of the same size would suggest.</p>`
    },
    {
      title: 'Diagnose a wrong analysis',
      body: `    <p>An analyst re-analyses the FIFA 11+ trial by fitting a logistic regression of injury on assignment across all 344 players, treating each player as an independent observation. The result is reported with a very narrow confidence interval. Explain precisely what has gone wrong, say whether the point estimate or the interval is more affected, and name two analysis approaches that would fix it.</p>`,
      answer: `      <p>The analysis has treated 344 observations as 344 independent randomisations when only 21 independent randomisations occurred. Injuries within a team are correlated through shared coaching, pitches and fixture load, so each player contributes less than one observation's worth of independent information. The standard error is therefore too small and the interval too narrow, and the p-value is too low.</p>
      <p>The point estimate is much less affected than the interval. An unweighted individual-level comparison of assigned groups is usually close to unbiased for the assignment effect; it is the uncertainty that is misstated. Fixes include a cluster-level analysis comparing the 21 team-level injury rates, generalised estimating equations with an exchangeable working correlation and cluster-robust standard errors, or a mixed model with a random intercept for team.</p>`
    },
    {
      title: 'State what the trial estimated',
      body: `    <p>The experimental group recorded 26 injuries and the control group 82. Write one sentence stating the estimand this contrast targets, using the language of assignment rather than of receipt. Then explain, in two or three sentences, why the same trial cannot report the effect of completing every session simply by dropping the players who missed sessions.</p>`,
      answer: `      <p>The contrast targets the effect of being assigned to the additional post-training FIFA 11+ programme, rather than to the standard programme alone, on injuries over the season, under the level of adherence that actually occurred in the trial.</p>
      <p>Dropping non-completers breaks the randomisation, because completion is a choice made after assignment. Players who complete every session are likely to be fitter, more motivated, less injured already and at clubs with better organisation, and all of those also affect injury risk directly. The comparison of completers with controls is therefore an observational comparison inside a randomised trial, and it needs its own identification argument, not the trial's.</p>`
    },
    {
      title: 'Judge a baseline table',
      body: `    <p>A reviewer notes that in a 21-team trial, the intervention teams had a mean age of 24.1 years against 22.6 in control, and runs a significance test on the difference, which returns p = 0.31. The reviewer concludes that randomisation worked and no adjustment is needed. Give two separate criticisms of that reasoning.</p>`,
      answer: `      <p>First, the test answers the wrong question. Randomisation is a property of the assignment procedure, and if the sequence was properly generated and concealed, we already know any imbalance arose by chance. A significance test on a baseline variable tests a null we know to be true by design, so it can neither validate nor invalidate the randomisation.</p>
      <p>Second, a non-significant test does not mean the imbalance is harmless. With 21 clusters the test has very little power, and a 1.5-year age gap can still confound the injury comparison if age predicts injury. The relevant judgement is whether the imbalance is large enough on a variable that matters, which is a question about the magnitude and about prior knowledge of injury risk, not about a p-value. Pre-specified adjustment for strong prognostic baseline variables is the usual response.</p>
      <p>A good answer also notes what the reviewer should have examined instead: how the sequence was generated, whether allocation was concealed, and how much loss to follow-up occurred in each arm.</p>`
    },
    {
      title: 'Find the interference',
      body: `    <p>Two of the 21 teams in a similar trial share a training ground and several coaching staff, and one is assigned to the intervention and one to control. Explain which assumption this threatens, what it does to the estimate, and what the trialists could have done at the design stage.</p>`,
      answer: `      <p>It threatens the assumption of no relevant interference between clusters. The control team's potential outcome now depends on the other team's assignment, because coaches who learned the added programme are likely to use parts of it in the control sessions.</p>
      <p>The likely consequence is attenuation. The control arm receives some of the intervention, so the measured difference understates the true effect of the programme. Note that the direction is predictable here, which is not always the case with interference.</p>
      <p>At the design stage the trialists could have made the shared training ground the cluster rather than the team, so that both teams receive the same assignment, or excluded one of the pair, or stratified the randomisation so that linked teams are allocated together. Recording the contact between clusters and reporting it is the minimum.</p>`
    },
    {
      title: 'Choose the design for a new question',
      body: `    <p>A league wants to know whether a new video-based concussion recognition module for match officials reduces the number of players who continue playing after a head impact. There are 90 officials, who are assigned to matches centrally and rotate across all clubs. Recommend a unit of randomisation, state the main threat your choice creates, and name the estimand you would report.</p>`,
      answer: `      <p>Randomise the official, not the club or the match. The intervention is knowledge held by a person, it travels with the official across fixtures, and 90 officials gives far more independent allocations than the number of clubs would.</p>
      <p>The main threat is interference between officials, who talk to one another, attend the same briefings and work in teams on the same match. If a trained referee works with an untrained assistant, the assistant is partly exposed. A secondary threat is that outcomes are observed at the match, so matches must be attributed to an official, and matches with officials from both arms need a stated rule.</p>
      <p>Report an intention-to-treat effect: the effect of being assigned the module, rather than the usual guidance, on the rate of players continuing after a head impact across the matches that official worked in the follow-up season, with uncertainty clustered on the official.</p>`
    }
  ]
},
{
  n: 3,
  slug: 'dags-and-back-door-identification',
  title: 'Causal diagrams and back-door identification',
  lead: 'Reading paths, choosing an adjustment set, and recognising mediators and colliders.',
  related: 'Hernan and Robins, <em>What If</em>, Chapters 6 and 7; Ruiz de Villa, <em>Causal Inference for Data Science</em>, Chapters 3 and 7. The dismissal diagram is a constructed teaching example.',
  questions: [
    {
      title: 'Sort a control list',
      body: `    <p>For the effect of coach dismissal at matchweek 12 on points over the next five matches, classify each variable as a confounder to adjust for, a mediator to leave alone, a collider to avoid, or irrelevant. Give a one-line reason for each.</p>
    <ol>
      <li>Pre-season wage bill.</li>
      <li>Points from matchweeks 8 to 12.</li>
      <li>The new coach's preferred formation, adopted in matchweek 13.</li>
      <li>Whether the club appeared in a televised crisis documentary, which is caused both by dismissal rumours and by player unrest.</li>
      <li>The strictness of the referee appointed to matchweek 15.</li>
      <li>Number of first-team players injured at matchweek 12.</li>
    </ol>`,
      answer: `      <ol>
        <li>Confounder. Wage bill proxies squad strength, which affects both the board's decision and future points, and it is fixed before treatment.</li>
        <li>Confounder, and the most important one. Recent form causes the dismissal and predicts future points directly.</li>
        <li>Mediator. Formation is chosen after dismissal and carries part of the effect, so adjusting for it removes part of the total effect you are trying to estimate.</li>
        <li>Collider. It is a common effect of two variables, so conditioning on it can induce an association between dismissal rumours and player unrest that did not exist.</li>
        <li>Irrelevant, and potentially harmful. Referee strictness in a later match is not a cause of the matchweek-12 decision, so it opens no back-door path; adjusting for it adds noise and, if it is influenced by the club's post-dismissal conduct, becomes a post-treatment variable.</li>
        <li>Confounder. The injury list affects both the board's decision and the points available in the next five matches, and it is measured before time zero.</li>
      </ol>`
    },
    {
      title: 'Trace the path',
      body: `    <p>Write out, arrow by arrow, one back-door path from dismissal to future points that runs through squad strength. Then state which single variable, if adjusted for, blocks it, and explain what "blocks" means here in terms of what the remaining association represents.</p>`,
      answer: `      <p>The path is: dismissal, back along the arrow from squad strength to dismissal, then forward along the arrow from squad strength to future points. In the usual notation, dismissal is caused by squad strength, and squad strength causes future points.</p>
      <p>Adjusting for squad strength blocks it, because the path is a fork with squad strength at the junction and conditioning on the junction of a fork cuts the flow of association through it.</p>
      <p>Blocking means that within a stratum of squad strength, the remaining association between dismissal and future points no longer contains the part generated by strong clubs being both less likely to dismiss and more likely to earn points. If every back-door path is blocked and no post-treatment variable has been conditioned on, what remains is the causal effect, given the diagram is right.</p>`
    },
    {
      title: 'Make the diagram wrong on purpose',
      body: `    <p>Suppose the true diagram includes an arrow from board impatience to dismissal and an arrow from board impatience to future points, where board impatience is unmeasured. An analyst adjusts correctly for recent form, squad strength and injuries, and reports the result as the causal effect of dismissal. State what is wrong with the claim, and say whether the analyst could detect the problem from the data alone.</p>`,
      answer: `      <p>An open back-door path remains through board impatience, so conditional exchangeability fails and the estimate is confounded. Impatient boards may also interfere in transfers, brief against players or change targets, so the arrow to future points is plausible.</p>
      <p>The data alone cannot detect it. The adjustment set looks complete relative to the analyst's diagram, and the model will fit as well as it would if the diagram were correct. Nothing in the observed distribution flags a missing unmeasured common cause. This is the central limitation of diagram-based identification: the diagram encodes assumptions that the data do not test.</p>
      <p>What the analyst can do is a sensitivity analysis, stating how strong the impatience-dismissal and impatience-points relationships would need to be to overturn the finding, and seek a proxy or a design that does not rely on measuring it, which is what Lessons 7 to 11 provide.</p>`
    },
    {
      title: 'Explain a collider concretely',
      body: `    <p>An analyst studying formation and goal difference restricts the sample to matches that were selected for live television. Selection for television is caused both by the perceived quality of the two teams and by the expected entertainment value of the tactical matchup. Explain, in terms of the diagram, why this restriction is a form of conditioning on a collider, and describe the association it can manufacture.</p>`,
      answer: `      <p>Restricting the sample to television matches is conditioning on the variable "selected for television", which sits at the head of two arrows, one from team quality and one from tactical matchup. That makes it a collider on the path between the two causes.</p>
      <p>Conditioning on a collider induces an association between its causes within the selected sample. Among televised matches, if two ordinary teams appear, it is likely because the tactical matchup was appealing, and if the matchup is unremarkable, it is likely because the teams are strong. So within the sample, team quality and tactical matchup become negatively associated even if they are independent in the full fixture list.</p>
      <p>Because both quality and matchup relate to formation and to goal difference, the induced association contaminates the formation estimate. Nothing about the restriction looks like adjustment, which is why selection effects of this kind are easy to miss: sample selection is conditioning.</p>`
    },
    {
      title: 'Choose between two valid sets',
      body: `    <p>Two adjustment sets both satisfy the back-door criterion for the same effect. Set A contains recent form and squad strength. Set B contains recent form, squad strength, stadium capacity, average ticket price, city population and the club's social media following. Give two distinct reasons to prefer Set A, and name one circumstance in which adding a variable that is not needed for identification is nonetheless a good idea.</p>`,
      answer: `      <p>First, positivity and overlap. Each extra covariate thins the region where both treatment and control observations exist, so a large set can leave few or no comparable untreated clubs for some treated profiles, which forces extrapolation.</p>
      <p>Second, estimation noise and specification risk. More covariates mean more parameters, more chance of misspecifying a functional form, and wider intervals for no gain in bias reduction. Several of Set B's variables are also plausibly downstream of squad strength, so they risk being partly post-treatment or collider-like rather than merely redundant.</p>
      <p>The circumstance in which adding an unnecessary variable helps is precision: a variable that strongly predicts the outcome but not the treatment is not needed to block any path, but including it reduces residual variance and narrows the interval. The variable to avoid is the opposite case, one that predicts treatment strongly and the outcome weakly, which worsens overlap and can amplify any remaining bias.</p>`
    },
    {
      title: 'Diagnose the estimand shift',
      body: `    <p>A study reports "the effect of dismissal on points, controlling for recent form, squad strength, and the tactical style adopted after the change." Explain in two or three sentences which quantity the study has actually estimated, and describe a situation in which that quantity would be the right one to report.</p>`,
      answer: `      <p>By conditioning on post-treatment tactical style, the study has removed the part of the dismissal effect that runs through changing how the team plays. What remains is closer to a direct effect of dismissal not mediated by tactical change, rather than the total effect, and because tactical style is also affected by other post-treatment factors, the conditioning can additionally open collider paths.</p>
      <p>It would be the right quantity if the question were specifically about the non-tactical channel, for example whether the psychological jolt of a new voice matters once the playing approach is held fixed. That is a mediation question, and Lesson 16 shows that it needs its own assumptions rather than a control variable.</p>`
    },
    {
      title: 'Build a diagram from scratch',
      body: `    <p>A club wants to know whether giving a player a new long contract causes an improvement in his performance over the following season. Name at least four variables you would put in the diagram, draw the arrows in words, identify one back-door path and one mediator, and state a minimal adjustment set for the total effect.</p>`,
      answer: `      <p>A reasonable set of variables: performance in the season before the offer, the player's age, interest from other clubs, the club's financial position, the new contract itself, minutes played in the following season, and performance in the following season.</p>
      <p>Arrows: prior performance causes both the contract offer and later performance. Age causes prior performance, the offer and later performance. Outside interest causes the offer and, plausibly, later performance through unsettlement. The club's finances cause the offer. The contract causes minutes played, because a well paid player tends to be selected, and minutes cause later performance.</p>
      <p>A back-door path: contract, back to prior performance, forward to later performance. A mediator: minutes played.</p>
      <p>A minimal adjustment set for the total effect is prior performance, age and outside interest, subject to the club's financial position not affecting later performance through any other route. Minutes played must be left out, since adjusting for it would remove the selection channel that is part of the effect.</p>
      <p class="answer-note">There is no single correct diagram here. Mark your answer on whether every arrow you drew is defensible as a causal claim, whether you avoided conditioning on anything after the contract, and whether you can say aloud what would make your diagram wrong.</p>`
    }
  ]
},
{
  n: 4,
  slug: 'emulate-a-target-trial',
  title: 'Emulate a target trial',
  lead: 'Eligibility, treatment strategies, time zero, follow-up and the timing errors they prevent.',
  related: 'Hernan and Robins, <em>What If</em>, Section 3.6 and Chapter 22. The dismissal protocol is a constructed teaching example.',
  questions: [
    {
      title: 'Write a protocol',
      body: `    <p>Write a target trial protocol, one sentence per part, for the question of whether promoting a goalkeeper from the academy to first-choice status affects goals conceded. Cover eligibility, the two treatment strategies, assignment, time zero, follow-up, outcome and estimand.</p>`,
      answer: `      <p>A defensible protocol reads roughly as follows. Eligibility: clubs in the top two divisions at the start of any league matchweek that have an academy goalkeeper registered for first-team selection and no first-choice goalkeeper under a long-term injury lay-off. Strategies: start the academy goalkeeper in each of the next ten league matches, or start the incumbent senior goalkeeper in each of the next ten. Assignment: the ideal trial randomises at the matchweek; the emulation adjusts for measured causes of the observed selection. Time zero: the moment the team sheet is due for the first of those matches. Follow-up: from time zero through those ten league matches. Outcome: goals conceded across the ten matches. Estimand: the per-protocol effect of following the academy strategy rather than the incumbent strategy among eligible club-matchweeks.</p>
      <p>Mark yourself on three things: eligibility is assessed using information available at time zero only, the two strategies are both sustained strategies rather than a one-off action against a vague alternative, and follow-up starts at the same instant for both.</p>`
    },
    {
      title: 'Find the immortal time',
      body: `    <p>An analyst defines the treated group as clubs that dismissed their coach at any point in the season, and starts follow-up for every club on the opening day. Explain why the treated group's early season is guaranteed in a way the control group's is not, say which direction the resulting bias runs for a survival-style outcome, and propose a correction.</p>`,
      answer: `      <p>To be classified as treated, a club must survive to its dismissal date without having been excluded. The period between the opening day and the dismissal is time during which the club was, by construction, not yet treated but is counted as treated person-time. That stretch is immortal in the sense that no event could have removed the club from the treated group.</p>
      <p>The bias favours the treated group. Their record accumulates a guaranteed stretch of exposure, so treatment looks better than it is, whether the outcome is time to relegation, time to a manager-free season or simply points accumulated over misassigned weeks.</p>
      <p>The correction is to define repeated decision points, one per matchweek. At each matchweek, assess eligibility from information available then, assign each eligible club to the strategy its observed behaviour is consistent with at that moment, and start follow-up there. A club that dismisses in matchweek 20 contributes control-consistent time at earlier matchweeks and treated time from matchweek 20, rather than being retrospectively labelled treated from day one.</p>`
    },
    {
      title: 'Clone and censor',
      body: `    <p>A club is eligible at time zero. It does not dismiss its coach until the third follow-up match, then dismisses. Describe how the cloning and censoring approach handles this club, state when each clone is censored, and explain what has to be assumed for censoring not to bias the result.</p>`,
      answer: `      <p>At time zero the club's observed data are compatible with both strategies, because it has not yet done anything that rules either out. The analyst creates two copies. One is assigned to immediate dismissal and one to retention for five matches, and both are followed from time zero.</p>
      <p>The dismissal clone is censored almost immediately, at the end of the 48-hour window, because the club did not dismiss then and so stopped adhering to that strategy. The retention clone is followed until the third match and is censored at the point of dismissal, because from then on the club no longer adheres to retention.</p>
      <p>Censoring is informative if the reasons a club deviates also predict the outcome, which they plainly do here, since a club dismisses in match three because results were poor. The assumption needed is exchangeability for censoring given the measured time-varying covariates, meaning that among clubs with the same recorded history up to that point, whether a club continued to adhere is unrelated to its potential outcome. Inverse-probability-of-censoring weights use that assumption, and it also requires positivity, meaning some clubs with each covariate history do continue to adhere.</p>`
    },
    {
      title: 'Two strategies that are not the same',
      body: `    <p>Distinguish these two control strategies, and explain why they can produce different estimates: "retain the coach for the next five league matches" and "do not dismiss the coach today". Which one is easier to emulate from observational records, and which one answers the board's question?</p>`,
      answer: `      <p>The first is a sustained strategy. It says what the club does over the whole follow-up window, and a club that dismisses in match two has deviated. The second is a point exposure. It constrains only today, and a club that dismisses tomorrow is fully compliant with it.</p>
      <p>They give different answers whenever the timing of a later dismissal matters. A comparison based on the point exposure mixes clubs that never changed with clubs that changed a week later, so it estimates the effect of a short delay rather than the effect of keeping the coach.</p>
      <p>The point exposure is easier to emulate, because it needs no adherence tracking and no censoring. The sustained strategy answers the board's question, because a board deciding tonight wants to know what happens if it stays with this coach, not what happens if it waits a week. This is why the sustained version needs the cloning and censoring machinery: the question that matters is the harder one to emulate.</p>`
    },
    {
      title: 'Fix an eligibility criterion',
      body: `    <p>A protocol states: "Eligible clubs are those in the bottom half of the table at matchweek 10 whose coach was still in post at the end of the season or who appointed a permanent, rather than interim, successor." Identify every problem with this criterion and rewrite it.</p>`,
      answer: `      <p>Both halves of the criterion use information from after time zero. Whether the coach lasted the season is known only in May, and whether the successor was permanent rather than interim is a feature of the treatment itself, not of eligibility. Using either one selects clubs on their future, which is the same error as the immortal-time case in Question 2, and the second also conditions on a version of treatment, which distorts the contrast.</p>
      <p>A rewritten criterion: eligible clubs are those in the bottom half of the table immediately after their matchweek-10 fixture, whose current head coach has been in post for at least eight league matches and for whom no departure has been publicly announced at that point.</p>
      <p>The general rule is that everything in the eligibility criterion must be measurable at or before time zero using only information the decision-maker had.</p>`
    },
    {
      title: 'Versions of treatment',
      body: `    <p>Explain how the version-of-treatment problem changes the interpretation of the dismissal effect, and describe the two honest ways a protocol can respond to it. Say which response you would choose if the dataset contains 60 permanent appointments and 40 interim ones, and why.</p>`,
      answer: `      <p>If "dismiss" covers both a permanent appointment and an interim caretaker, and those two have different effects, then the potential outcome under dismissal is not well defined for a club. The estimate becomes an average over whatever mix of versions happened to occur, and it will not transfer to a club or league with a different mix.</p>
      <p>The two honest responses are, first, to narrow the strategy so that only one version counts, for example dismissal followed by a permanent appointment within seven days, with interim appointments excluded or censored; and second, to keep the broad strategy but state explicitly that the estimand is the effect of a policy that permits the observed distribution of versions, and to report that distribution.</p>
      <p>With 60 permanent and 40 interim appointments, either is workable, and I would take the second while also reporting the first as a subgroup. The broad estimand answers the policy question a board actually faces, because at the moment of dismissal a board does not know for certain which version it will end up with, and 100 units is too few to split without losing precision. Reporting the version mix is what makes the estimate interpretable.</p>`
    },
    {
      title: 'Emulate a trial you cannot run',
      body: `    <p>UEFA is considering a rule that no club may dismiss a coach between matchweeks 1 and 10. Write down the target trial that would settle whether the rule improves competitive balance, then name the two features of that trial that no observational emulation can reproduce, and say what the emulation would have to assume instead.</p>`,
      answer: `      <p>The target trial: eligible units are top-division clubs at the start of a season; the strategies are "dismissal prohibited during matchweeks 1 to 10" and "dismissal permitted throughout"; assignment is randomised at club-season level; time zero is the opening day; follow-up is the full season; the outcome is a competitive balance measure such as the standard deviation of final points across the league, or a club-level measure such as final points; and the estimand is the ATE of the rule across eligible club-seasons.</p>
      <p>Two features that cannot be reproduced. First, randomisation of a rule: no observational record contains clubs randomly forbidden from sacking, so the emulation must instead find variation in early-season dismissal behaviour and assume it is as good as random given measured covariates. Second, and more fundamental, the outcome is a league-level quantity, so the units interfere with each other by construction: one club's rule changes another club's points. A randomised club-level trial within one league would not even deliver the estimand, which means the true target trial randomises whole leagues.</p>
      <p>The emulation would therefore have to assume either that leagues which differ in their dismissal norms are comparable after adjustment, which is a strong cross-league exchangeability assumption, or that a natural experiment such as a rule change in one league gives a credible comparison, which is the design Lessons 8 and 12 build.</p>`
    }
  ]
},
{
  n: 5,
  slug: 'matching-and-propensity-scores',
  title: 'Matching and propensity scores',
  lead: 'Score estimation, common support, balance diagnostics, and what matching cannot fix.',
  related: '<a href="https://doi.org/10.1016/j.ejor.2020.03.062">Goller and Krumer (2020)</a>; Hernan and Robins, <em>What If</em>, Section 4.5 and Chapter 15; Ruiz de Villa, Chapter 5.',
  questions: [
    {
      title: 'Screen the covariates',
      body: `    <p>For the effect of scheduling a fixture on a non-frequent day on attendance, decide whether each variable may enter the propensity model, and give a one-line reason: last season's average attendance; the expected television audience estimated when the schedule was drawn up; rainfall recorded during the match; the away club's league position on the morning of the match; whether the match was later moved again; and the number of tickets sold.</p>`,
      answer: `      <ol>
        <li>Last season's average attendance: yes. It is fixed before scheduling and plausibly affects both the scheduling decision and attendance.</li>
        <li>Expected television audience at scheduling time: yes. It is precisely the kind of information the scheduler used, and it predicts demand.</li>
        <li>Rainfall during the match: no. It occurs after treatment and cannot have caused the scheduling decision. A forecast available at scheduling time could be considered instead.</li>
        <li>Away club's league position on the morning of the match: borderline and usually no. Schedules are set weeks or months ahead, so position on the day was not available to the scheduler. Position at the time the schedule was fixed would be the right version.</li>
        <li>Whether the match was moved again: no. It is post-treatment and is arguably part of the treatment history.</li>
        <li>Tickets sold: no. It is the outcome, or so close to it as to make no difference.</li>
      </ol>
      <p>The organising question for every row is the same: was this quantity determined before the scheduling decision, and could it have influenced that decision?</p>`
    },
    {
      title: 'Apply a radius',
      body: `    <p>A treated fixture has a propensity score of 0.62. Candidate control fixtures have scores 0.60, 0.64, 0.66, 0.55 and 0.71. With a radius of 0.05, list which controls are eligible. Then suppose the treated fixture is a derby and none of the eligible controls is. State what you would do and why the score alone did not catch this.</p>`,
      answer: `      <p>Eligible controls are those within 0.05 of 0.62, so 0.60, 0.64 and 0.66. The fixtures at 0.55 and 0.71 fall outside the radius.</p>
      <p>If the treated fixture is a derby and none of its matches is, the design has failed on a covariate that matters a great deal for attendance, even though the numerical distance is small. I would check the balance of the derby indicator across the whole matched sample, and if it is poor, either match exactly on the derby indicator and use the score within those strata, or add the indicator with a stronger role in the model, or drop derbies to a separately reported analysis while stating the change in target population.</p>
      <p>The score alone did not catch it because the propensity score is a summary. Two fixtures with the same probability of being scheduled unusually can differ on any covariate whose contributions happen to offset. The balancing property holds in expectation over the whole sample, not fixture by fixture, so balance must be checked on the original covariates after matching. This is exactly why a well fitting treatment model is not the diagnostic that matters.</p>`
    },
    {
      title: 'Read a balance table',
      body: `    <p>After matching, an analyst reports standardised mean differences: derby indicator 0.02, last season's attendance 0.04, expected TV audience 0.31, home club position 0.05, stadium capacity 0.01. The treatment model has a c-statistic of 0.88, which the analyst describes as excellent. Write the verdict you would give, and say what you would change.</p>`,
      answer: `      <p>The design has not succeeded. Four covariates are well balanced, but the expected television audience is at 0.31, far above the conventional 0.1 threshold, and it is likely one of the strongest determinants of both scheduling and attendance. A single badly imbalanced strong confounder is enough to leave the estimate confounded, and averaging the diagnostics is not a defence.</p>
      <p>The c-statistic is not a merit at all here. It measures how well treatment is predicted, which is a separate question from whether the matched sample is balanced, and a very high value often signals poor overlap, because it means treated and control fixtures are easy to tell apart.</p>
      <p>I would respecify the propensity model to allow a more flexible relationship for the television audience, such as splines or interactions with capacity, rematch, and re-examine the balance. If balance still fails, I would restrict the analysis to the region of common support where balance is achievable and state the resulting population, or move to a method that targets balance directly, such as entropy balancing.</p>`
    },
    {
      title: 'Reason about common support',
      body: `    <p>An analyst finds that all fixtures involving Champions League clubs on rearranged Monday nights have propensity scores above 0.9, and no control fixture exceeds 0.85. Describe the two options available, and state precisely how the estimand differs between them.</p>`,
      answer: `      <p>Option one is to keep those fixtures and let the model extrapolate, using controls that are not really comparable. This preserves the nominal target population but the estimate for those units rests entirely on the functional form of the model rather than on data, and it is not identified, because positivity fails.</p>
      <p>Option two is to trim to the region of common support and drop them. This gives an estimate that is supported by data, but the estimand changes: it now describes the effect among fixtures for which both scheduling outcomes plausibly occur, and it says nothing about elite midweek rearrangements.</p>
      <p>The second is the honest choice, provided the paper describes the retained population explicitly rather than continuing to call it "the effect on league fixtures". The trimmed estimand is often the more useful one anyway, because a scheduler has no real discretion over the fixtures that were dropped.</p>`
    },
    {
      title: 'State what matching cannot do',
      body: `    <p>A referee objects that the matched study "cannot rule out that better-supported clubs were given the unusual slots for reasons the data do not capture". Explain whether more covariates, a better model or a larger sample would address the objection, and name what would.</p>`,
      answer: `      <p>None of the three addresses it. Matching removes imbalance on measured covariates; it has no purchase on an unmeasured common cause. A more flexible model balances the same variables better. A larger sample narrows the interval around a biased estimate, which makes the problem worse to the extent that it lends false confidence. More covariates help only if the new ones capture the missing cause, which is the referee's point, not a rebuttal of it.</p>
      <p>What would address it: a design that does not rely on measuring the confounder. A discontinuity in the scheduling rule, an instrument affecting scheduling but not demand, a within-fixture comparison across seasons with fixed effects, or a natural experiment such as a broadcast contract change. Failing that, a formal sensitivity analysis stating how strong an unmeasured confounder would need to be to overturn the result, which is an honest bound rather than a fix.</p>`
    },
    {
      title: 'Order the workflow',
      body: `    <p>Put these steps in the order a defensible matched analysis performs them, and explain why two of them must not be swapped: check covariate balance; estimate the outcome contrast; select covariates on causal grounds; estimate the propensity score; define common support; match within a radius.</p>`,
      answer: `      <p>The order is: select covariates on causal grounds; estimate the propensity score; define common support; match within a radius; check covariate balance; estimate the outcome contrast.</p>
      <p>The pair that must not be swapped is the last two. If the outcome contrast is computed before balance is checked, the analyst can revise the design after seeing the answer, and the reported estimate then reflects a search over specifications rather than a pre-committed design. The whole point of separating design from analysis is that everything before the outcome step can be iterated freely, using only treatment and covariate data, without any risk of tuning towards a preferred result.</p>
      <p>Selecting covariates before estimating the score is the second pairing worth noting: covariates enter on causal grounds, not because they improve the fit of the treatment model.</p>`
    },
    {
      title: 'Choose a design for a new question',
      body: `    <p>A club wants to know whether signing a player over 30 on a three-year contract affects the club's wage-bill efficiency over those three years. Sketch a matched design: name the treatment, the target estimand, four covariates, the main positivity worry and the balance check you would insist on.</p>`,
      answer: `      <p>Treatment: signing a player aged 30 or over to a contract of three or more years during a given transfer window, with the comparison being signing a player under 30 to a contract of the same length, or making no equivalent signing, depending on which decision the club actually faces. Naming the comparison explicitly is the part most answers skip.</p>
      <p>Estimand: the ATT, because the question is whether the signings clubs actually made were good ones.</p>
      <p>Covariates measured before the window: the club's league position and points per match in the prior season, its wage bill, the size and age profile of the existing squad in that position, and the fee and reported wage of the signing itself if the comparison holds cost fixed.</p>
      <p>Positivity worry: the richest clubs sign expensive over-30 players almost always, and small clubs almost never, so at the extremes of the wage-bill distribution one arm may be empty. Expect to trim and to report a mid-range population.</p>
      <p>The balance check I would insist on is on prior-season wage bill and squad age profile, because those drive both the signing decision and the efficiency outcome; standardised mean differences under 0.1 on both, examined before any outcome is computed.</p>`
    }
  ]
},
{
  n: 6,
  slug: 'weighting-standardisation-and-aipw',
  title: 'Weighting, standardisation and AIPW',
  lead: 'Three routes from the same identification assumptions, and what double robustness does not buy.',
  related: '<a href="https://doi.org/10.1111/sjpe.12369">Bryson et al. (2024)</a>; Hernan and Robins, <em>What If</em>, Chapters 12, 13, 15 and 18; Ruiz de Villa, Chapter 8. The AIPW discussion is a constructed extension.',
  questions: [
    {
      title: 'Compute the weights',
      body: `    <p>Four clubs have estimated dismissal probabilities and observed decisions: club A, e = 0.80, dismissed; club B, e = 0.80, retained; club C, e = 0.30, dismissed; club D, e = 0.30, retained. Compute each club's inverse-probability weight for an ATE analysis. Say which club receives the largest weight and explain in plain terms what that club is being asked to represent.</p>`,
      answer: `      <p>Treated clubs receive 1/e and untreated clubs receive 1/(1-e).</p>
      <p>Club A: 1/0.80 = 1.25. Club B: 1/0.20 = 5. Club C: 1/0.30 = 3.33. Club D: 1/0.70 = 1.43.</p>
      <p>Club B receives the largest weight. It is a club that, on its measured characteristics, was very likely to dismiss and did not. In the pseudo-population it is standing in for all the similar high-risk clubs that dismissed, supplying the retention outcome that none of them can supply. That is a lot of representational load for one observation, which is why a weight of 5 already deserves attention and a weight of 18 deserves alarm.</p>`
    },
    {
      title: 'Describe the pseudo-population',
      body: `    <p>Explain in your own words what the weighted sample represents, and why the weighted association between dismissal and points can be read causally when the unweighted one cannot. Then state which identification assumption the weighting operationalises and which one it does not touch.</p>`,
      answer: `      <p>Weighting constructs a hypothetical population in which each covariate profile appears with its original frequency, but within every profile the treated and untreated are represented in the same proportions as if treatment had been assigned by a coin flip. Upweighting the unusual choices repairs the imbalance that selection created.</p>
      <p>In that constructed population, treatment is unrelated to the measured covariates by construction, so the association between treatment and outcome no longer contains the part driven by those covariates. Given the diagram, what remains is the causal effect.</p>
      <p>The weighting operationalises conditional exchangeability, turning it into a reweighted comparison, and it depends on positivity, which is visible in the weights: an estimated probability near zero or one produces an enormous weight, which is what a positivity violation looks like numerically. It does not touch consistency at all, and it does nothing whatsoever about unmeasured confounding, since a variable absent from the model cannot be balanced by weights derived from that model.</p>`
    },
    {
      title: 'Contrast the two routes',
      body: `    <p>Weighting and standardisation target the same estimand under the same assumptions. Describe the different thing each one models, and name one situation where you would prefer each.</p>`,
      answer: `      <p>Weighting models the treatment: it estimates the probability of dismissal given covariates and uses that to reweight observed outcomes. Standardisation models the outcome: it fits points as a function of treatment and covariates, predicts each club twice, once under dismissal and once under retention, and averages the two sets of predictions over the target population.</p>
      <p>Prefer weighting when the treatment process is well understood and easy to model but the outcome is complicated. Board dismissal decisions follow a fairly legible logic in league position and recent form, whereas points over five matches depend on many things, so a misspecified outcome model is the greater risk.</p>
      <p>Prefer standardisation when overlap is weak or the treatment model produces extreme weights, and when the outcome relationship is smooth and well captured. Standardisation is also the natural route when the target population differs from the sample, since you can average the predictions over whatever population you want, which makes it the standard way of transporting an effect.</p>`
    },
    {
      title: 'Interpret an extreme weight',
      body: `    <p>An untreated club receives a weight of 18. Say what that implies about its estimated propensity score, explain the effect on the variance of the estimate, and give two responses, noting the cost of each.</p>`,
      answer: `      <p>A weight of 18 for an untreated club means 1/(1-e) = 18, so e is about 0.944. The model believes this club had a 94 per cent chance of dismissal and it retained.</p>
      <p>One observation carrying that much weight dominates the estimate in its region of covariate space. The variance rises sharply, the interval widens, and the point estimate becomes sensitive to that single club's outcome, so any idiosyncrasy in it propagates into the headline number.</p>
      <p>Response one is to trim or truncate: cap weights at a stated percentile, and report results with and without the cap. The cost is bias, since truncation deliberately misrepresents the pseudo-population, and the amount is unknown. Response two is to redefine the target population, restricting to a range of propensity scores where both arms are populated. The cost is that the estimand changes and no longer describes high-risk clubs. In either case, reporting the whole weight distribution is not optional, and a diagnosis of the model specification comes first, since extreme scores are sometimes an artefact of a badly specified model rather than genuine non-overlap.</p>`
    },
    {
      title: 'State double robustness precisely',
      body: `    <p>Write a precise one-sentence statement of what double robustness guarantees for AIPW. Then mark each of these claims true or false, with a reason: (a) AIPW is consistent if both nuisance models are wrong; (b) AIPW removes the need to choose an adjustment set; (c) AIPW still requires positivity; (d) AIPW gives a valid answer under unmeasured confounding if the outcome model fits well.</p>`,
      answer: `      <p>Statement: given identification, that is conditional exchangeability, positivity and consistency, the AIPW estimator remains consistent for the target contrast if at least one of the propensity model and the outcome model is correctly specified, even if the other is not.</p>
      <ul>
        <li>(a) False. The guarantee requires one of the two to be correct. With both wrong there is no protection, and in practice both are usually somewhat wrong, which is why double robustness is better understood as an improvement in the rate of convergence and a reduction in sensitivity than as a licence.</li>
        <li>(b) False. Identification comes first and is entirely a matter of causal reasoning. Double robustness concerns the specification of two nuisance models after the adjustment set has been justified.</li>
        <li>(c) True. Positivity is an identification condition, and it is also a practical one, since the weighted correction terms contain the propensity score in the denominator and blow up as it approaches zero or one.</li>
        <li>(d) False. No estimator recovers an effect that the data do not identify. A well fitting outcome model fits the observed outcomes; it has nothing to say about a confounder it never saw.</li>
      </ul>`
    },
    {
      title: 'Read the estimating expression',
      body: `    <p>The AIPW expression is the mean of m1(X) - m0(X) + A(Y - m1(X))/e(X) - (1-A)(Y - m0(X))/(1-e(X)). Identify which part is the standardisation estimator, and explain in words what the two remaining terms do when the outcome model is a good one and when it is a poor one.</p>`,
      answer: `      <p>The standardisation estimator is the first part, the mean of m1(X) - m0(X), the average difference between the two predicted potential outcomes.</p>
      <p>The other two are weighted residual corrections, one for the treated and one for the untreated. Each takes the part of the observed outcome that the outcome model failed to predict, the residual, and adds it back in with an inverse-probability weight.</p>
      <p>When the outcome model is good, the residuals are small and close to mean zero within covariate strata, so the corrections contribute little and the estimator behaves much like standardisation. When the outcome model is poor, the residuals are large and systematic, and the weighting is what carries the estimate: reweighting the residuals correctly compensates for the model's failure, provided the propensity model is right. That is the mechanism behind double robustness, and it also explains why the correction terms are the source of instability when the propensity score is near zero or one.</p>`
    },
    {
      title: 'Rewrite an overclaim',
      body: `    <p>A colleague writes: "We used entropy balancing, so the treated and control clubs are equivalent and the estimate is causal." Rewrite the sentence so that it is defensible, and list the additional evidence you would want in the paper before believing the number.</p>`,
      answer: `      <p>A defensible rewriting: "We used entropy balancing to equalise the means and variances of the measured pre-departure covariates between departure and non-departure observations. Under the assumptions that these covariates include all important common causes of departure and subsequent performance, that comparable non-departure observations exist for every departure profile, and that the departure category represents a sufficiently uniform intervention, the balanced comparison estimates the causal effect."</p>
      <p>Evidence I would want: the balance achieved, before and after, on every covariate and not only on the moments targeted; the distribution of the weights, including the maximum; the effective sample size after weighting; the covariate list with a causal justification rather than a predictive one; a description of the population that survived any trimming; a sensitivity analysis for unmeasured confounding; and a statement of how the version-of-treatment problem was handled, since coach departures include resignations, sackings and mutual agreements.</p>`
    }
  ]
}
];
