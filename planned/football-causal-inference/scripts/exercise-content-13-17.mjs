export const sheets = [
{
  n: 13,
  slug: 'interrupted-time-series',
  title: 'Interrupted time series',
  lead: 'Segmented models, level against slope, autocorrelation and co-interventions.',
  related: '<a href="https://doi.org/10.17533/udea.iatreia.238">Duque-Arias et al. (2024)</a>; Ruiz de Villa, Chapter 11; Wooldridge, Chapters 10 to 12.',
  questions: [
    {
      title: 'Interpret the coefficients',
      body: `    <p>A segmented model of weekly muscular injury rate gives beta1 = 0.02, beta2 = -0.40 and beta3 = +0.05, where beta1 is the pre-interruption slope, beta2 the level change at the interruption and beta3 the change in slope. Explain each coefficient in plain language, state the post-interruption slope, and compute the modelled difference from the old trend at week 12 after the interruption.</p>`,
      answer: `      <p>beta1 = 0.02 means the injury rate was rising by 0.02 units per week before the interruption. beta2 = -0.40 means that at the moment of the interruption the rate dropped immediately by 0.40 units relative to where the continued old trend would have put it. beta3 = +0.05 means the slope after the interruption is 0.05 units per week steeper than before.</p>
      <p>The post-interruption slope is 0.02 + 0.05 = 0.07 units per week.</p>
      <p>At week 12 the difference from the counterfactual old trend is -0.40 + 12 x 0.05 = -0.40 + 0.60 = +0.20. The immediate drop has been more than reversed by the steeper trend, and the series crosses the counterfactual at week 8.</p>
      <p class="answer-note">This pattern, a favourable jump followed by an unfavourable slope, is common and is why reporting only the level change is misleading. Always state the horizon at which the effect is quoted.</p>`
    },
    {
      title: 'Name the counterfactual',
      body: `    <p>State exactly what the interrupted time series design uses as the counterfactual, and explain why this makes the design weaker than difference in differences even when the fit is excellent. Then name the single feature of a series that most improves the credibility of that counterfactual.</p>`,
      answer: `      <p>The counterfactual is the continuation of the pre-interruption trend into the post-period, extrapolated from the fitted model. It is generated entirely from the treated unit's own history; no comparison unit is involved.</p>
      <p>That is weaker than difference in differences because nothing in the design accounts for shocks that arrive at the same time as the interruption. Difference in differences uses a contemporaneous control group, which absorbs whatever both groups experienced. An interrupted time series has no such protection, so any co-intervention or coincident change is attributed to the interruption. An excellent fit to the pre-period says the extrapolation is smooth, not that it is right about a period nobody observed.</p>
      <p>The feature that most improves credibility is a long, stable pre-period with many observations and no other breaks, because it makes the trend well estimated and lets the analyst see whether the series is genuinely trend-stationary rather than wandering. A close second, and the better fix, is adding an untreated control series, which turns the design into a controlled interrupted time series.</p>`
    },
    {
      title: 'List and rank the co-interventions',
      body: `    <p>For the pandemic restart of Colombian professional football, name four changes other than the restart itself that could plausibly have shifted muscular injury rates. Rank them by how seriously they threaten the causal reading, and explain your top choice.</p>`,
      answer: `      <p>Four candidates: a compressed fixture calendar raising match load; a long lay-off degrading conditioning before the restart; a change to the permitted number of substitutions altering individual exposure; and changed medical access or injury surveillance altering how injuries were detected and recorded.</p>
      <p>My ranking, most to least threatening: the lay-off, the compressed calendar, the surveillance change, then substitutions.</p>
      <p>The lay-off is the most serious because it is not separable from the treatment even in principle. The interruption is the lay-off, so the design cannot distinguish the effect of returning to competition from the effect of the detraining that preceded it. The others are, at least conceptually, separable, and could be handled with data: fixture density can be measured and included, substitution rules are known and dated, and surveillance changes can be checked by looking at the mix of injury severities recorded. When a co-intervention is definitionally bound to the interruption, the honest response is to redefine the estimand as the effect of the whole package and to say so.</p>`
    },
    {
      title: 'Fix the outcome definition',
      body: `    <p>An analyst uses the weekly count of muscular injuries as the outcome. After the restart, both the count and the number of matches played rise sharply. Explain why the count is the wrong outcome, write down a better one, and say what assumption the fix requires.</p>`,
      answer: `      <p>The count confounds injury risk with exposure. If players spend more hours training and playing, more injuries occur even at an unchanged risk per hour, so the level jump would be manufactured by the schedule rather than by any change in player vulnerability.</p>
      <p>A better outcome is the injury rate per 1,000 hours of player exposure, computed from recorded training and match hours, or an equivalent per-1,000-match-hours rate if training data are unavailable.</p>
      <p>The fix assumes that exposure hours are measured accurately in both periods and that risk scales roughly proportionally with exposure. The second assumption is not innocuous: fatigue accumulates, so the tenth hour in a week is more dangerous than the first, and a simple rate can understate the effect of congestion. If that non-linearity matters, exposure belongs in the model as a covariate with a flexible form rather than only in the denominator. A good answer notes that this is itself a substantive claim about how load causes injury.</p>`
    },
    {
      title: 'Diagnose autocorrelation',
      body: `    <p>Residuals from the segmented regression show a first-order autocorrelation of 0.55. Explain what this does to the reported standard errors and to the point estimate, describe how you would detect it, and name two ways to handle it.</p>`,
      answer: `      <p>Positive autocorrelation means neighbouring weeks share shocks, so consecutive residuals carry overlapping information and the effective number of independent observations is far below the nominal count. Ordinary least squares standard errors, which assume independence, are therefore too small, intervals too narrow and p-values too low. The point estimate remains approximately unbiased, though it is less efficient; the damage is almost entirely to inference.</p>
      <p>Detection: plot the residuals against time and look for runs of the same sign, inspect the autocorrelation and partial autocorrelation functions, and use a formal test such as Durbin-Watson or Breusch-Godfrey.</p>
      <p>Handling: fit a model with an explicit error structure, such as regression with ARMA errors or a Prais-Winsten transformation, chosen to match the autocorrelation pattern; or keep ordinary least squares and use Newey-West heteroskedasticity and autocorrelation consistent standard errors with a sensibly chosen lag length. A third option, aggregating to a coarser time unit, reduces the problem but throws away resolution on the level change, which is the quantity of interest.</p>`
    },
    {
      title: 'Handle seasonality',
      body: `    <p>Injury rates in this league are systematically higher in the six weeks after preseason and again during the congested end-of-year period. The interruption happens to fall in the congested period. Explain the danger, and describe two ways to prevent the seasonal pattern from contaminating the estimate.</p>`,
      answer: `      <p>If the interruption coincides with a seasonal peak, the model will attribute the seasonal rise to the interruption. The extrapolated counterfactual carries only the fitted linear trend, not the recurring within-year pattern, so the level change absorbs whatever the season would have produced anyway. The direction is predictable: the effect will look harmful.</p>
      <p>The first way is to model seasonality explicitly, adding harmonic terms or calendar-month indicators estimated from the multi-year pre-period, so the counterfactual continues both the trend and the seasonal cycle. This requires enough pre-period years to estimate the cycle, which is the practical constraint.</p>
      <p>The second is to compare like with like across years, for example by using the same weeks of previous seasons as the comparison, which effectively converts the design into a controlled comparison against the unit's own seasonal history. Adding a genuine control series from a league that did not interrupt achieves the same thing more convincingly, since it absorbs the seasonal pattern without requiring the analyst to specify it correctly.</p>`
    },
    {
      title: 'Design a controlled version',
      body: `    <p>A league introduces a mandatory concussion substitute protocol on a known date. You have weekly data on the number of players returning to play after a head impact, for that league and for two comparable leagues that made no change. Specify the design, write the contrast you would report, and name the assumption you would defend most carefully.</p>`,
      answer: `      <p>Design: a controlled interrupted time series. Fit a segmented model to the treated league and to each control league over the same weeks, with terms for time, the post-protocol indicator and time since the protocol, plus interactions with a treated-league indicator so the contrast is estimated directly. Model seasonality and exposure as in Question 6, and use an error structure that handles serial correlation.</p>
      <p>Contrast to report: the difference between the treated league's level and slope changes and the control leagues' contemporaneous changes at the same dates, that is, the interaction terms, reported at a stated horizon such as 12 and 26 weeks after the protocol, alongside the full plotted series.</p>
      <p>The assumption I would defend hardest is that the control leagues experienced no comparable change at the same time. Concussion protocols tend to be adopted in waves following the same international guidance, so the most likely failure is that the control leagues quietly changed practice too, even without a formal rule. I would document each control league's regulatory history explicitly, and check for a level shift in the controls at the same date, since finding one would invalidate them as controls.</p>`
    }
  ]
},
{
  n: 14,
  slug: 'longitudinal-g-methods',
  title: 'Longitudinal g-methods',
  lead: 'Treatment-confounder feedback, sustained strategies and the three g-methods.',
  related: 'Hernan and Robins, <em>What If</em>, Chapters 19 to 21. The training-load example is constructed.',
  questions: [
    {
      title: 'Identify the double role',
      body: `    <p>Weekly minutes played increase soreness. Soreness affects the coach's decision about the following week's minutes, and soreness also predicts injury. State soreness's two roles precisely, and explain why this makes the standard advice about controlling for confounders self-contradictory here.</p>`,
      answer: `      <p>Soreness in week t is a mediator of the effect of minutes in week t-1, because earlier minutes cause it and it lies on a path to injury. It is simultaneously a confounder of the effect of minutes in week t, because the coach uses it to set that week's minutes and it independently predicts injury.</p>
      <p>The standard advice says to adjust for confounders of treatment and outcome, and also says never to adjust for mediators of the treatment being studied. Soreness is both, so the two rules issue opposite instructions about the same variable. Adjusting for it removes the week t confounding but blocks part of the week t-1 effect and, because soreness is a collider on paths involving unmeasured causes of injury, can also open new biasing paths. Not adjusting leaves the week t effect confounded.</p>
      <p>The resolution is that no single regression can be right. The estimand must be a whole treatment strategy across weeks, and the covariate history must be handled in time order, which is what the g-methods do.</p>`
    },
    {
      title: 'Write two strategies',
      body: `    <p>Write down two contrasting sustained treatment strategies for the weekly load decision, one static and one dynamic. Explain the practical difference, and say which one a fitness coach is more likely to find useful and why.</p>`,
      answer: `      <p>Static: assign high load every Monday for the whole season, regardless of the player's state. The comparison static strategy is moderate load every Monday.</p>
      <p>Dynamic: assign high load whenever the player's fatigue score is at or below 6 on a 10-point scale, and moderate load otherwise, evaluated each Monday. A comparison dynamic strategy might use a threshold of 4.</p>
      <p>The practical difference is that the dynamic strategy is a rule that reads the player's current state, so the treatment a player receives under it depends on his history, whereas the static strategy ignores it. Estimating a dynamic strategy requires modelling how the covariate evolves, since the rule's future assignments depend on it.</p>
      <p>A coach finds the dynamic strategy more useful, and by a wide margin. No coach would ever apply a fixed load to a visibly exhausted player, so the static contrast estimates the effect of a policy nobody would implement, and it is also the one most likely to violate positivity. The dynamic rule matches how the decision is actually made and answers the question the coach has, which is where to put the threshold.</p>`
    },
    {
      title: 'Compute a weight',
      body: `    <p>For a two-week history, a player received high load in week 1 when the probability of high load given baseline was 0.5, then moderate load in week 2 when the probability of moderate load given the full history was 0.2. Compute the unstabilised inverse-probability weight for this history. Explain what a weight of that size means, and describe what a stabilised weight would change.</p>`,
      answer: `      <p>The unstabilised weight is the product of the inverse probabilities: 1/0.5 x 1/0.2 = 2 x 5 = 10.</p>
      <p>This player represents ten players in the pseudo-population. The large value comes from the week 2 choice: given his history, moderate load was unusual, so he is one of few observations supplying information about that branch of the treatment history. Note how the weights multiply across time, which is why long follow-up produces extreme weights even when each period's probability is unremarkable.</p>
      <p>A stabilised weight replaces the numerator of 1 with the probability of the observed treatment given only baseline covariates, and treatment history, rather than 1. This leaves the same balance property but shrinks the spread of the weights dramatically, because the numerator moves in the same direction as the denominator. The estimate is unchanged in expectation and the variance is much smaller, which is why stabilised weights are the default rather than an option.</p>`
    },
    {
      title: 'Compare the three methods',
      body: `    <p>Describe in two sentences each what the parametric g-formula, a marginal structural model and a structural nested model do. Then name one situation favouring each.</p>`,
      answer: `      <p>Parametric g-formula: models how each time-varying covariate and the outcome evolve given the past, then simulates every player forward under each strategy and averages the simulated outcomes. It reconstructs the whole counterfactual world rather than reweighting the observed one.</p>
      <p>Marginal structural model: estimates the probability of the observed treatment at each time given the past, weights each observed history by the inverse of that probability, and fits a simple model for the outcome as a function of the treatment strategy in the weighted data. The weighting creates sequential balance so the simple model can be read causally.</p>
      <p>Structural nested model: parameterises the effect of a treatment increment at each time given the past, and uses g-estimation to find the parameter value that makes treatment independent of the transformed, effect-removed outcome. It models the effect directly rather than the outcome level.</p>
      <p>Favouring situations: the g-formula when positivity is near-violated and one is willing to extrapolate from an outcome model, or when many complex dynamic strategies must be compared. Marginal structural models when the strategies are few and simple and one prefers to model the treatment process, which is often better understood than the outcome. Structural nested models when effect modification by time-varying covariates matters and when near-violations of positivity make weighting unstable, since g-estimation is markedly more robust there.</p>`
    },
    {
      title: 'Diagnose positivity',
      body: `    <p>Club policy forbids high load whenever fatigue exceeds 8 on a 10-point scale. (a) Can the data estimate a strategy that assigns high load at fatigue 9? (b) Distinguish this from the situation where high load at fatigue 9 is allowed but happens only twice in the dataset, and say what each case demands of the analyst.</p>`,
      answer: `      <p>(a) No. The policy makes the probability of high load at fatigue 9 exactly zero, so no observation exists and none could exist in this setting. This is a structural or deterministic positivity violation, and no estimator can repair it; any number produced comes wholly from the model's extrapolation.</p>
      <p>(b) The second case is a random or practical positivity violation. The decision is possible but rare, so the data contain a little information, with two observations carrying enormous weights and dominating the estimate.</p>
      <p>The demands differ. For the structural violation the analyst must change the question: redefine the target strategy so that it never requires high load above fatigue 8, which is anyway the clinically sensible rule, or obtain data from a league without the policy. Reporting an estimate for the original strategy is not an option. For the practical violation, the analyst can proceed but must show the weight distribution, report the effective sample size, examine sensitivity to truncation, and state plainly that the estimate for that region rests on two observations. The g-formula is often preferred there, since it extrapolates through a model transparently rather than through an unstable weight.</p>`
    },
    {
      title: 'Get the time order right',
      body: `    <p>An analyst records fatigue at the end of each week, after the training block has been completed, and uses week t fatigue as the confounder for the week t load decision. Explain the error, describe its likely consequence, and say what data collection change fixes it.</p>`,
      answer: `      <p>The confounder for a decision must be measured before that decision. Fatigue recorded at the end of week t is partly a consequence of the load assigned in week t, so it is a post-treatment variable for that decision. Conditioning on it removes part of the very effect being estimated and, because it is a common effect of the load and of unmeasured player characteristics that also cause injury, conditioning opens a collider path.</p>
      <p>The likely consequence is an attenuated and possibly sign-flipped estimate. High load raises end-of-week fatigue, so comparing high and moderate load players at equal end-of-week fatigue compares an unusually resilient high-load player with an unusually fragile moderate-load one.</p>
      <p>The fix is to record fatigue on Monday morning before the load decision, and to timestamp every covariate so that the analysis can order them relative to each decision. In practice this means designing the data collection around the decision points rather than around the weekly reporting cycle, which is the single most common source of failure in longitudinal analyses of this kind.</p>`
    },
    {
      title: 'Specify a study',
      body: `    <p>A club wants to know whether a policy of resting a player for one league match after every European away fixture reduces injuries across a season. Specify the two strategies, the decision points, the time-varying confounder that creates feedback, the estimand, and one positivity worry.</p>`,
      answer: `      <p>Strategies: rest the player for the next league match after every European away fixture, or make him available for selection as normal after every European away fixture. Both are sustained strategies applied across the whole season.</p>
      <p>Decision points: each league match that follows a European away fixture, so roughly six to ten points across a season, with eligibility assessed at each.</p>
      <p>Feedback variable: accumulated load and fatigue, or a soreness or wellness score measured before each selection. It is caused by earlier selection decisions, it drives the current one, and it predicts injury, which is exactly the feedback structure.</p>
      <p>Estimand: the difference in the expected number of time-loss injuries over the season, or in injury-free days, comparing the two sustained strategies among players who play regularly in both competitions.</p>
      <p>Positivity worry: a manager will not rest a key player before a decisive fixture, so for histories where the next league match is high-stakes and the squad is depleted, the resting strategy may never be observed. Estimating it requires either a dynamic strategy that permits selection in those states, or an explicit acknowledgement that the contrast is unidentified in that region.</p>`
    }
  ]
},
{
  n: 15,
  slug: 'double-machine-learning',
  title: 'Double machine learning',
  lead: 'Residualisation, cross-fitting, leakage-safe folds, and what flexibility does not buy.',
  related: '<a href="https://arxiv.org/abs/2602.16830">Ruiz-Menarguez and Badiella (2026)</a>, a preprint; Hernan and Robins, Sections 18.3 and 18.4; Ruiz de Villa, Chapters 4 and 8.',
  questions: [
    {
      title: 'Separate the parameter from the nuisances',
      body: `    <p>For the effect of starting in a 4-3-3 rather than a 4-4-2 on full-time goal difference, state what the causal parameter is and name the two nuisance functions. Then explain, in one sentence, why estimating the nuisances well is not the same achievement as identifying the effect.</p>`,
      answer: `      <p>The causal parameter is the contrast in expected full-time goal difference between starting 4-3-3 and starting 4-4-2, for the stated population of fixtures.</p>
      <p>The nuisance functions are the conditional expectation of goal difference given the pre-match covariates, and the conditional probability of choosing 4-3-3 given those same covariates, which is the propensity score for the formation contrast.</p>
      <p>Estimating them well is a prediction achievement, and prediction says nothing about whether the covariate set blocks the back-door paths, whether both formations plausibly occur for similar fixtures, or whether the formation categories correspond to well defined interventions; a flawless learner fitted to the wrong covariate set produces a precisely estimated confounded number.</p>`
    },
    {
      title: 'Explain residualisation',
      body: `    <p>Explain what the residual of treatment on covariates represents in the formation setting, and why regressing the outcome residual on the treatment residual recovers the effect. Then say what happens to the design if the treatment residual has almost no variance, and what real-world situation would cause that.</p>`,
      answer: `      <p>The treatment residual is the part of the formation choice not explained by pre-match covariates: the variation left after accounting for opponent strength, venue, injuries and team identity. Intuitively it is the quasi-random component of the manager's decision.</p>
      <p>The outcome residual is the part of goal difference not explained by those same covariates. Relating the two isolates the association between the unexplained part of the decision and the unexplained part of the result, which under conditional exchangeability contains no contribution from the covariates and so is the causal effect. Orthogonalising both sides is what makes the final estimate insensitive to small errors in either nuisance model, to first order.</p>
      <p>If the treatment residual has almost no variance, the covariates predict formation nearly perfectly and there is essentially nothing left to identify the effect from. The estimate becomes unstable, since it divides by a near-zero quantity, and the interval explodes. In football this occurs when a manager always plays the same shape against a given kind of opponent, or when team identity is included as a covariate and each team's formation is near-deterministic. It is the machine-learning face of a positivity violation, and the honest response is to narrow the population to fixtures where both formations genuinely occur.</p>`
    },
    {
      title: 'Design the folds',
      body: `    <p>The dataset has ten seasons for the same 20 clubs. Explain why random match-level folds leak, name two grouping schemes, and say how you would choose between them.</p>`,
      answer: `      <p>Random match-level folds place matches involving the same club, in the same season, in both the training and the held-out set. The learner can then memorise team-season specific effects, and the out-of-fold predictions are not genuinely out of sample. The nuisance predictions are too good, the residuals are too small, and the orthogonality that cross-fitting is supposed to provide is compromised.</p>
      <p>Two schemes: group by season, holding out whole seasons at a time; or group by club-season, holding out all matches of a given club in a given season.</p>
      <p>Choose by matching the fold structure to the dependence you are worried about and to the generalisation you intend. If the estimate is meant to apply to future seasons, hold out seasons, since that mimics the intended use. If it is meant to apply to other clubs, hold out clubs. Club-season grouping is the safer default here, because it breaks both the within-club and the within-season leakage while retaining enough folds for stable estimation. A good answer notes that this is the same reasoning used for any time-dependent or clustered prediction problem; nothing about it is specific to causal inference.</p>`
    },
    {
      title: 'Refuse a control',
      body: `    <p>A colleague proposes adding expected goals, possession share and half-time score to the covariate set, noting that cross-validated predictive performance improves substantially. Write your response, covering what happens to the estimand and why the improvement in prediction is beside the point.</p>`,
      answer: `      <p>All three are measured after kick-off and are therefore consequences of the starting formation. Adding them changes the estimand from the total effect of the formation choice to something like a direct effect holding the match's realised pattern fixed, which is not the quantity a manager choosing a shape before kick-off wants.</p>
      <p>Worse, they are also affected by unmeasured in-match events, so conditioning on them opens collider paths and can produce bias in either direction, not merely attenuation. Half-time score is the clearest case: it is squarely on the causal path.</p>
      <p>The improvement in predictive performance is exactly what one would expect from post-treatment variables, because they contain information about the outcome that the pre-match covariates cannot have. That is a reason to exclude them, not to include them. Predictive performance is a diagnostic for the nuisance models within a fixed, causally justified covariate set; it is never a criterion for choosing that set. The covariate set is decided by the diagram, before any model is fitted.</p>`
    },
    {
      title: 'Handle a categorical treatment',
      body: `    <p>Formation is a categorical variable with eight observed values, several of them rare. Explain why "the effect of formation" is not a well posed estimand, and describe how you would restructure the analysis. Name the diagnostic you would run for each contrast you keep.</p>`,
      answer: `      <p>With eight categories there is no single contrast to estimate. An effect requires two named strategies, and "formation" names neither. A regression coefficient on a multi-category variable is a bundle of implicit comparisons against a reference category, weighted by however the data happen to be distributed, and it will not correspond to any decision a manager faces.</p>
      <p>Restructure by naming the contrasts of interest explicitly, for example 4-3-3 against 4-4-2 and 3-5-2 against 4-4-2, and estimating each as a separate binary problem with its own propensity model, restricted to fixtures where both formations plausibly occur. Rare formations should be pooled into a coherent category only if they represent a similar intervention, and otherwise dropped with the change in population stated.</p>
      <p>For each retained contrast, the diagnostic is overlap: plot the distribution of the estimated probability of choosing the first formation, separately for fixtures where each was chosen, and confirm that both distributions have common support away from zero and one. Balance on the original covariates within the analysed region is the second check. Without those, a contrast should not be reported however good the learner is.</p>`
    },
    {
      title: 'Say what cross-fitting does and does not do',
      body: `    <p>Mark each claim true or false with a one-line reason: (a) cross-fitting removes the bias from using a flexible learner on the same data used to estimate the effect; (b) cross-fitting guarantees overlap; (c) cross-fitting means the covariate set no longer needs justification; (d) with cross-fitting, a regularised learner's bias in the nuisance functions can still affect the effect estimate.</p>`,
      answer: `      <ul>
        <li>(a) True, in the relevant sense. Cross-fitting removes the own-observation overfitting bias by ensuring each observation's nuisance predictions come from models that never saw it, which is what allows flexible learners to be used without the resulting bias entering the effect estimate at first order.</li>
        <li>(b) False. Overlap is a property of the data and the covariate set. Cross-fitting changes how the nuisance functions are fitted and has no bearing on whether both treatments occur for similar units.</li>
        <li>(c) False. Identification precedes estimation entirely. Cross-fitting is a device for estimating nuisance functions honestly; it cannot tell a confounder from a mediator.</li>
        <li>(d) True. The orthogonal score makes the estimate insensitive to nuisance errors to first order, but the protection is not absolute: if both nuisance functions converge slowly, the product of their errors can still be large enough to matter, which is why the rate conditions in the theory are stated as a joint requirement rather than a promise.</li>
      </ul>`
    },
    {
      title: 'Judge a study',
      body: `    <p>A preprint reports that a 4-3-3 raises expected points by 0.14 per match against a 4-4-2, using cross-fitted gradient boosting on 22,000 fixtures, with covariates including team identity, opponent identity, venue, pre-match injuries and bookmaker odds. Write a critique of at most seven sentences.</p>`,
      answer: `      <p>The design is sound in outline, with a large sample, cross-fitting and a plausible set of pre-match covariates, but three issues need addressing before the number can be believed. First, bookmaker odds are an unusually powerful covariate that may already incorporate the expected formation, in which case conditioning on them removes part of the very variation being used and the estimate is attenuated towards zero. Second, including team and opponent identity as covariates risks driving the treatment residual towards zero for managers with fixed tactical preferences, so the estimate may rest on a small and unrepresentative subset of fixtures; the overlap plot and the distribution of the treatment residual should be reported. Third, the fold structure is not described, and random match-level folds across ten seasons of the same clubs would leak, so the paper must state that folds were grouped by club-season or season. Beyond these, the estimand needs a population: 0.14 points per match applies to fixtures where both formations were realistic choices, which is not all fixtures. It would also be worth knowing whether the formation label is taken from the announced line-up or from realised positional data, since the two differ often enough to raise a consistency question. As a preprint that has not been peer reviewed, it should be read as a well constructed example of the method rather than as a settled finding.</p>`
    }
  ]
},
{
  n: 16,
  slug: 'causal-mediation',
  title: 'Causal mediation',
  lead: 'Total, direct and indirect effects, and why randomising treatment is not enough.',
  related: '<a href="https://doi.org/10.1080/08870446.2026.2677081">Roynesdal et al. (2026)</a>; Hernan and Robins, Chapters 4 to 8; Ruiz de Villa, Chapter 6.',
  questions: [
    {
      title: 'Name the three parts',
      body: `    <p>A warm-up programme reduces injuries partly by improving landing technique. Name the treatment, mediator and outcome, then define the total, indirect and direct effects for this example in one sentence each, in terms of what each would tell a physiotherapist.</p>`,
      answer: `      <p>Treatment: assignment to the warm-up programme. Mediator: landing technique measured after a training period but before the injuries of interest. Outcome: subsequent time-loss injury.</p>
      <p>The total effect tells the physiotherapist how much injury risk falls if the squad is put on the programme, counting every mechanism it operates through. The indirect effect through landing technique tells them how much of that reduction is delivered by the improvement in technique specifically, which is the part that a technique-focused coaching intervention might reproduce. The direct effect tells them how much reduction remains from everything else the programme does, such as improved strength, mobility or warm-up compliance, with technique held at the value it would have taken without the programme.</p>
      <p>The practical value of the split is that it tells the physiotherapist whether to invest in a technique programme or in the other components, which the total effect alone cannot.</p>`
    },
    {
      title: 'Explain the gap in randomisation',
      body: `    <p>The warm-up programme is randomised at club level. Explain why this identifies the total effect but not the indirect effect. Name three variables that could confound the mediator-outcome relationship in this example, and say which of them can be handled by measurement.</p>`,
      answer: `      <p>Randomisation makes assignment independent of all potential outcomes, so the assignment-to-injury contrast is identified. It says nothing about landing technique, which is not assigned but achieved: players end up with the technique they end up with, and the reasons they do are not randomised. The mediator-outcome comparison is therefore an observational comparison sitting inside a randomised trial.</p>
      <p>Three candidate confounders: baseline athletic coordination, which improves technique and independently protects against injury; training effort or conscientiousness, which raises both technique gains and general injury-avoidant behaviour; and prior injury history, which limits technique improvement and strongly predicts future injury.</p>
      <p>Prior injury history and baseline coordination can be measured before randomisation and adjusted for, so they are tractable. Effort is the hard one: it is partly a response to the programme itself, which makes it a treatment-induced confounder rather than a baseline one, and adjusting for it blocks part of the treatment effect while failing to adjust leaves the mediator-outcome relationship confounded. That is the structural problem, not a data collection failure.</p>`
    },
    {
      title: 'Diagnose the treatment-induced confounder',
      body: `    <p>In the EuroFIT setting, the programme changes physical ability, and physical ability affects both autonomous motivation, the mediator, and physical activity, the outcome. Explain why this specific structure defeats the ordinary approach, and name the class of estimand that is still available.</p>`,
      answer: `      <p>Physical ability is caused by the programme and confounds the mediator-outcome relationship. Adjusting for it blocks a portion of the treatment's effect, since ability is on a causal path from programme to activity, and it can also open a collider path if ability shares unmeasured causes with activity. Not adjusting leaves the motivation-activity comparison confounded. Neither choice is correct, and the problem is structural rather than a matter of finding a better model.</p>
      <p>Consequently the natural direct and indirect effects are not identified by any adjustment for measured covariates, because their definition requires setting the mediator to the value it would have taken under the other treatment, while ability itself would also have differed.</p>
      <p>What remains available are interventional effects. Instead of the individual-level nested counterfactual, these compare outcomes when the mediator is drawn from the distribution it would have had under one treatment versus the other, given covariates. That quantity is identified under weaker conditions in the presence of a treatment-induced confounder, and it corresponds to a real intervention that shifts the population distribution of motivation, which is arguably closer to what a programme designer could actually do.</p>`
    },
    {
      title: 'Choose the effect definition',
      body: `    <p>Explain the difference between a natural indirect effect and an interventional indirect effect in plain terms, and say which you would report for the EuroFIT motivation question and why. Include one respect in which your choice is worse.</p>`,
      answer: `      <p>A natural indirect effect asks what would happen to each individual if he received the programme but his motivation took the value it would have taken had he not received it. That is a within-person counterfactual pairing that no intervention could produce, since nobody can be treated and untreated at once.</p>
      <p>An interventional indirect effect asks what would happen if the programme were delivered and motivation were then drawn at random from the distribution it has among untreated people with the same covariates. It is a population-level shift rather than a person-level swap.</p>
      <p>I would report the interventional version. It remains identified with a treatment-induced confounder, which the EuroFIT setting has, and it corresponds to a hypothetical action a programme designer could describe: change the motivation distribution and leave everything else alone.</p>
      <p>The cost is interpretability at the individual level. The interventional effect does not decompose the total effect into two parts that necessarily add up in the same clean way, and it answers a question about a randomly assigned mediator distribution, which is not quite the mechanism question people think they are asking. Being explicit that the reported quantity is not the textbook decomposition is part of reporting it honestly.</p>`
    },
    {
      title: 'Get the timing right',
      body: `    <p>An analyst measures autonomous motivation and physical activity in the same follow-up questionnaire, twelve weeks after randomisation. Explain the two distinct problems this creates, and describe the measurement schedule you would have specified instead.</p>`,
      answer: `      <p>The first problem is temporal order. A mediator must precede the outcome; if both are recorded at the same moment, there is no evidence that motivation changed before activity rather than after it. Activity plausibly raises motivation, so the arrow could run the other way, and the analysis would then report reverse causation as mediation.</p>
      <p>The second is shared measurement error. Both are self-reported in one questionnaire, so a respondent's mood, recall style or desire to please the researcher affects both answers. That common cause of the two measurements induces an association between them that has nothing to do with any causal path, and it inflates the estimated indirect effect.</p>
      <p>A better schedule measures baseline covariates and both variables before randomisation, the mediator at an intermediate point such as six weeks, and the outcome at twelve weeks, ideally with the outcome captured objectively, by accelerometer rather than by self-report, so the two do not share a measurement process. Separating the instruments matters as much as separating the times.</p>`
    },
    {
      title: 'Report a fragile result',
      body: `    <p>A mediation analysis estimates an indirect effect of 0.21 that falls to 0.04 when a plausible degree of unmeasured mediator-outcome confounding is assumed, and to 0.11 under an alternative mediator measurement. Write the two or three sentences you would put in the paper's abstract.</p>`,
      answer: `      <p>"The programme increased physical activity, and the estimated share operating through autonomous motivation was 0.21 under our primary specification. This estimate was not robust: it fell to 0.04 under a plausible level of unmeasured mediator-outcome confounding and to 0.11 under an alternative measure of motivation. We therefore report the total effect as our primary finding and treat the mediation results as exploratory, consistent with a mediating role for motivation but not establishing its magnitude."</p>
      <p class="answer-note">Mark yourself on whether you led with the fragility rather than burying it, whether you avoided the phrase "partially mediated by", which implies a settled decomposition, and whether the total effect was foregrounded as the finding the design actually supports.</p>`
    },
    {
      title: 'Decide whether to do it at all',
      body: `    <p>A club has a randomised trial showing that a sleep-education programme reduces injuries. The medical staff want to know whether the effect runs through sleep duration. Write down what you would need before attempting a mediation analysis, and state the circumstances under which you would advise against it.</p>`,
      answer: `      <p>Requirements: a mediator measured objectively and repeatedly between randomisation and the outcome window, so timing is unambiguous; baseline measurement of the plausible mediator-outcome confounders, including prior injury, training load, age and baseline sleep; a stated effect definition, natural or interventional, chosen before analysis; a plan for treatment-induced confounders such as changed training schedules; sufficient sample size, which is the constraint that most often bites, since mediation estimates are far less precise than total-effect estimates; and a pre-specified sensitivity analysis for unmeasured mediator-outcome confounding.</p>
      <p>I would advise against it if the mediator is measured only once and at the same time as the outcome; if the trial is small, since an underpowered mediation analysis mostly generates noise that gets reported as mechanism; if no credible baseline confounders were collected; or if the decision the club faces does not actually depend on the answer. That last point deserves weight: if the club will run the whole programme regardless, the mechanism is interesting but not decision-relevant, and the analysis will consume credibility that the total effect has already earned.</p>`
    }
  ]
},
{
  n: 17,
  slug: 'causal-survival-analysis',
  title: 'Causal survival analysis',
  lead: 'Risk, restricted mean survival time, hazards, censoring and competing events.',
  related: '<a href="https://doi.org/10.1007/s40279-017-0834-8">Rossler et al. (2018)</a>; Hernan and Robins, Chapter 17 and Section 21.5.',
  questions: [
    {
      title: 'Compute three contrasts',
      body: `    <p>By week 20, 12 per cent of control players and 8 per cent of programme players have been injured. Compute the risk difference and the risk ratio, and state each in a sentence a coach would understand. Then, given restricted mean injury-free times of 18.2 weeks under the programme and 17.4 under control, state that contrast and say what it adds.</p>`,
      answer: `      <p>Risk difference: 8 minus 12, which is -4 percentage points. Four fewer players per hundred are injured by week 20 under assignment to the programme.</p>
      <p>Risk ratio: 8 divided by 12, about 0.67. Assignment to the programme cuts the chance of being injured by week 20 to about two-thirds of what it would otherwise be, a relative reduction of a third.</p>
      <p>Restricted mean difference: 18.2 minus 17.4, which is 0.8 injury-free weeks over a 20-week horizon. It adds timing information the risk contrast discards: it counts not only whether players were injured but how much of the window they spent available, so a programme that delays injuries without preventing them still registers here while showing nothing in the week-20 risk.</p>
      <p>A good answer notes that all three carry the same horizon, and that quoting any of them without "by week 20" makes them uninterpretable.</p>`
    },
    {
      title: 'Explain why a hazard ratio is awkward',
      body: `    <p>Explain, using the injury trial, why a hazard ratio is not a risk ratio and why it can be difficult to interpret causally even in a randomised trial. Then say what a hazard ratio that drifts from 0.6 in early weeks to 1.0 later most likely indicates.</p>`,
      answer: `      <p>A hazard ratio compares instantaneous injury rates among players who remain uninjured at each time. After the first few weeks, the two risk sets are no longer the randomised populations: the control arm has lost more players to injury, so those remaining in it are disproportionately the robust ones. The comparison at week 15 is therefore between two groups selected on a post-randomisation event, and that selection is itself caused by treatment. Randomisation protects the comparison at time zero, not at every later conditioning point.</p>
      <p>This is why a hazard ratio is not a risk ratio: it is a ratio of rates within changing, treatment-selected risk sets, whereas a risk ratio compares the original randomised groups over a fixed horizon.</p>
      <p>A hazard ratio drifting from 0.6 to 1.0 is most likely the depletion of susceptibles rather than a fading treatment effect. The control arm's frail players are injured early, leaving a hardier residual whose rate approaches the treated arm's. The programme may still be preventing injuries throughout, which is precisely what the cumulative risk or restricted mean would show. Reporting a single proportional-hazards number here would misdescribe the trial.</p>`
    },
    {
      title: 'Choose the time scale',
      body: `    <p>Compare calendar weeks, training hours and match exposures as the time scale for the 11+ Kids trial. Say what question each answers, and identify the danger in using exposure time when the intervention might change exposure.</p>`,
      answer: `      <p>Calendar weeks answer the question a club asks about a season: how many players will be unavailable by a given date. Training hours answer a physiological question about risk per unit of load, which is the natural scale for comparing incidence across squads with different schedules. Match exposures isolate the competitive setting, where injury mechanisms differ from training.</p>
      <p>The danger with exposure time is that it can be a consequence of treatment. If the programme improves conditioning and players consequently train more, then using hours as the denominator divides out part of the treatment's effect, and the rate per hour can look unchanged while calendar-time risk has genuinely fallen. Worse, if the programme reduces injuries, treated players accumulate more exposure simply by staying available, which means the denominators differ for reasons caused by the treatment.</p>
      <p>The safe practice is to fix calendar time as the primary scale for the causal contrast, since it is not affected by treatment, and to report exposure-based incidence as a secondary descriptive quantity while stating that exposure is post-randomisation. If an exposure-scaled estimand is genuinely wanted, it has to be defined as a mediation or a per-unit-load question, with the corresponding assumptions.</p>`
    },
    {
      title: 'Deal with censoring',
      body: `    <p>A player transfers at week 12 and is lost to follow-up. State the assumption under which simply censoring him is harmless. Then suppose players with early soreness are both more likely to transfer and more likely to be injured later: explain what breaks, and describe the analysis that addresses it and what it requires.</p>`,
      answer: `      <p>Censoring is harmless if, conditional on the recorded history and treatment arm, players who leave have the same later injury distribution as those who stay. Informally, leaving must carry no information about future injury beyond what is already recorded.</p>
      <p>With soreness driving both, that fails. The players who leave are disproportionately those who would have been injured, so the remaining sample is favourably selected, and observed injury rates understate the truth. Because soreness may be more common in one arm, the bias need not cancel between arms, so the treatment contrast is affected and not merely the absolute level.</p>
      <p>The fix is inverse-probability-of-censoring weighting: model the probability of remaining uncensored at each time given treatment and the recorded history, including soreness, then upweight the players who remain so that they stand in for the similar players who left. It requires that the causes of both censoring and injury be measured and recorded before the censoring occurs, positivity in the sense that players with every relevant history have some chance of staying, and a correctly specified censoring model. It cannot rescue a study that never recorded soreness.</p>`
    },
    {
      title: 'Handle a competing event',
      body: `    <p>A player retires from football permanently at week 8 and can never record the study injury. Explain why this is not the same as censoring, describe the two estimands available, and say which you would report for a club deciding whether to fund the programme.</p>`,
      answer: `      <p>Censoring means the event may still occur but we stop observing it. A competing event means the event of interest can no longer occur at all: a retired player has no later injury time to be hidden. Treating retirement as censoring implicitly imagines a world in which the player continued playing, which is a counterfactual the data do not support and, for permanent retirement, may be incoherent.</p>
      <p>Two estimands. The first is the real-world cumulative incidence, the probability of being injured by week 20 accounting for the fact that some players retire and therefore cannot be. This is a total effect that includes any effect of treatment on retirement itself. The second is a controlled direct effect, the risk of injury by week 20 in a hypothetical world where retirement is eliminated, which isolates the injury mechanism but describes a world that does not exist.</p>
      <p>For a club deciding whether to fund the programme, the real-world cumulative incidence is the right choice. The club cares how many players will actually be unavailable, and if the programme keeps players in the game longer, that consequence belongs in the number rather than being assumed away. The controlled direct effect is the appropriate quantity for a physiologist asking about the injury mechanism itself.</p>`
    },
    {
      title: 'Read a trial report',
      body: `    <p>A trial reports "a hazard ratio of 0.52, p = 0.01, from a mixed-effects Cox model with a random intercept for club" and concludes that the programme "halves injuries". List the questions you would ask before accepting the conclusion.</p>`,
      answer: `      <p>What is the absolute effect? A hazard ratio without a risk difference or restricted mean difference gives no sense of how many injuries are actually prevented, and 0.52 on a small baseline risk may be worth very little.</p>
      <p>Over what horizon, and does the hazard ratio hold constant across it? A single number presumes proportional hazards; the report should show the survival curves and a check of that assumption, since depletion of susceptibles makes drift likely.</p>
      <p>Does "halves injuries" mean the risk of a first injury or the total number of injuries? A Cox model of time to first injury says nothing about recurrences, which is what a club's availability actually depends on.</p>
      <p>What was the time scale, and was exposure affected by the intervention? What was the censoring pattern, how many players were lost, and were the reasons related to injury risk? Were competing events present and how were they handled? Was clustering handled adequately, given that a random intercept for club addresses correlation but the effective sample size is the number of clubs, not players? And was the analysis by assignment or by adherence?</p>
      <p>The conclusion should read, at best, that assignment to the programme reduced the rate of first injury, with an absolute reduction of a stated size over a stated horizon.</p>`
    },
    {
      title: 'The whole course in six lines',
      body: `    <p>Choose one football decision you actually care about and write six lines: the eligible population; two treatment strategies; outcome and horizon; estimand; identification assumptions; estimator with its diagnostics. Then write a seventh line naming the assumption you are least able to defend, and what evidence would change your mind about it.</p>`,
      answer: `      <p>There is no single right answer. Mark your own on the following, which is the checklist the whole course has been building.</p>
      <ul>
        <li>Is the population defined by information available at a decision point, with no criterion that uses the future?</li>
        <li>Are both strategies named, sustained where the decision is repeated, and precise enough that two analysts would classify every unit identically?</li>
        <li>Does the outcome have a definition and a horizon, and is the horizon attached to every number you would quote?</li>
        <li>Is the estimand a named contrast for a named population, ATE, ATT, LATE, a local threshold effect or a strategy contrast, rather than "the effect"?</li>
        <li>Are the identification assumptions stated as claims about the world that could be wrong, not as a list of statistical conditions?</li>
        <li>Does the estimator come last, and does each diagnostic you name correspond to a specific assumption rather than to model fit?</li>
        <li>Is the seventh line honest? The assumption you are least able to defend is usually exchangeability or positivity, and if you wrote "consistency" it is worth checking whether you simply have not yet found the confounder.</li>
      </ul>
      <p>If you could not write the first five lines without reaching for an estimator, that is the signal to return to Lessons 1 and 4 rather than to press on.</p>`
    }
  ]
}
];
