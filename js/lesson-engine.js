/*
 * MATH → CODE lesson engine
 * Converts every curriculum row into a consistent deep lesson.
 * Static-only: no API, database, login, or server required.
 */
const FORMULAS = {
  "GCD & LCM":"gcd(a,b)=gcd(b,a mod b),   lcm(a,b)=|ab|/gcd(a,b)",
  "Linear Equations":"ax+b=c  ⇒  x=(c-b)/a,  a≠0",
  "Quadratic Equations":"ax²+bx+c=0  ⇒  x=(-b±√(b²-4ac))/(2a)",
  "Pythagorean Theorem":"a²+b²=c²",
  "Slope":"m=(y₂-y₁)/(x₂-x₁)",
  "Distance Formula":"d=√((x₂-x₁)²+(y₂-y₁)²)",
  "Simple Interest":"I=Prt",
  "Compound Interest":"A=P(1+r/n)^(nt)",
  "Arithmetic Progression":"aₙ=a₁+(n-1)d",
  "Geometric Progression":"aₙ=a₁r^(n-1)",
  "Binomial Theorem":"(a+b)ⁿ=Σ C(n,k)aⁿ⁻ᵏbᵏ",
  "Permutation":"P(n,r)=n!/(n-r)!",
  "Combination":"C(n,r)=n!/(r!(n-r)!)",
  "Probability":"P(A)=favourable outcomes / total outcomes",
  "Conditional Probability":"P(A|B)=P(A∩B)/P(B)",
  "Bayes' Theorem":"P(A|B)=P(B|A)P(A)/P(B)",
  "Derivative":"f'(x)=lim(h→0)[f(x+h)-f(x)]/h",
  "Product Rule":"(fg)'=f'g+fg'",
  "Quotient Rule":"(f/g)'=(f'g-fg')/g²",
  "Chain Rule":"d/dx f(g(x))=f'(g(x))g'(x)",
  "Power Rule":"d/dx xⁿ=nxⁿ⁻¹",
  "Definite Integrals":"∫ₐᵇ f(x)dx = F(b)-F(a)",
  "Fundamental Theorem of Calculus":"d/dx ∫ₐˣ f(t)dt=f(x)",
  "Dot Product":"a·b=Σaᵢbᵢ",
  "Matrix Multiplication":"(AB)ᵢⱼ=Σₖ AᵢₖBₖⱼ",
  "Determinant":"det(A) measures signed scale factor of a linear transformation",
  "Eigenvalues & Eigenvectors":"Av=λv",
  "Normal Distribution":"f(x)=1/(σ√(2π)) · exp(-(x-μ)²/(2σ²))",
  "Expected Value":"E[X]=Σx·P(X=x)",
  "Variance":"Var(X)=E[(X-μ)²]",
  "Standard Deviation":"σ=√Var(X)",
  "Fourier Transform":"F(ω)=∫ f(t)e^{-iωt}dt",
  "Convolution":"(f*g)(t)=∫f(τ)g(t-τ)dτ",
  "Gradient":"∇f=(∂f/∂x₁,…,∂f/∂xₙ)",
  "Divergence":"∇·F=Σ∂Fᵢ/∂xᵢ",
  "Laplacian":"∇²f=Σ∂²f/∂xᵢ²",
  "Euler-Lagrange Equation":"∂L/∂y-d/dx(∂L/∂y')=0",
  "Bayesian Inference":"posterior ∝ likelihood × prior",
  "PCA":"Σv=λv  (covariance eigenproblem)",
  "Central Limit Theorem":"(X̄-μ)/(σ/√n) → N(0,1)",
  "Hamming Distance":"d(x,y)=number of positions where xᵢ≠yᵢ",
  "Cross-Entropy":"L=-Σ yᵢ log(pᵢ)",
  "Softmax":"softmax(zᵢ)=eᶻⁱ/Σⱼeᶻʲ",
  "Euclidean Algorithm":"gcd(a,b)=gcd(b,a mod b)",
  "Newton's Method":"xₙ₊₁=xₙ-f(xₙ)/f'(xₙ)"
};

function jsFor(title){
  const q=title.toLowerCase();
  if(q.includes("gcd")||q.includes("euclidean")) return `function gcd(a,b){ while(b!==0){ [a,b]=[b,a%b]; } return Math.abs(a); }`;
  if(q.includes("factorial")||q.includes("permutation")||q.includes("combination")) return `function factorial(n){ let r=1; for(let i=2;i<=n;i++) r*=i; return r; }\n// Build the required combinatorial formula from factorials.`;
  if(q.includes("quadratic")) return `function quadratic(a,b,c){\n  const d=b*b-4*a*c;\n  if(d<0) return "complex roots";\n  return [(-b+Math.sqrt(d))/(2*a),(-b-Math.sqrt(d))/(2*a)];\n}`;
  if(q.includes("prime")) return `function isPrime(n){\n  if(n<2) return false;\n  for(let d=2; d*d<=n; d++) if(n%d===0) return false;\n  return true;\n}`;
  if(q.includes("average")||q.includes("mean")) return `const mean = xs => xs.reduce((s,x)=>s+x,0)/xs.length;`;
  if(q.includes("matrix")) return `function dot(a,b){ return a.reduce((s,x,i)=>s+x*b[i],0); }\n// Matrix algorithms are built from repeated dot products.`;
  if(q.includes("derivative")) return `const derivative = (f,x,h=1e-6) => (f(x+h)-f(x-h))/(2*h);\n// This is a numerical approximation, not symbolic differentiation.`;
  if(q.includes("integral")) return `function midpointIntegral(f,a,b,n=10000){\n  const h=(b-a)/n; let s=0;\n  for(let i=0;i<n;i++) s+=f(a+(i+.5)*h);\n  return s*h;\n}`;
  if(q.includes("probability")) return `const probability = (favourable,total) => favourable/total;`;
  if(q.includes("random walk")) return `let x=0; for(let i=0;i<100;i++) x += Math.random()<0.5 ? -1 : 1; console.log(x);`;
  if(q.includes("linear")) return `function solveLinear(a,b,c){ return (c-b)/a; } // ax+b=c`;
  return `// Translate the mathematical definition into data + operations.\nfunction solve(input){\n  // 1. validate the domain\n  // 2. represent the mathematical objects\n  // 3. apply the rule/algorithm\n  // 4. verify the result\n  return input;\n}`;
}

function levelNote(level){
  if(level==="Foundation") return "Build the concrete idea first. Use small integers and visible examples before optimizing.";
  if(level==="Core") return "Connect the definition to an algorithm. Check domains, edge cases, and representation choices.";
  return "Separate the mathematical theorem from its numerical implementation. State assumptions, approximation error, and stability.";
}

window.LESSONS = TOPICS.map((t,i)=>{
  const [field,level,title,summary,math,code,difference,keywords]=t;
  return {
    id:i, field, level, title, summary, math, code, difference, keywords,
    definition: math,
    notation: FORMULAS[title] || "Use the notation given by the definition; symbols describe mathematical objects, not storage locations.",
    formula: FORMULAS[title] || "No single formula defines this topic; the definition, laws, or algorithm are the primary mathematical object.",
    intuition: summary + " Think of the definition as the rule; examples show what the rule does.",
    humanMethod: "Write the definition → identify known values and constraints → perform the mathematical transformation → check the result against the original conditions.",
    representation: code,
    javascript: jsFor(title),
    differenceDetailed: difference + " In programming, you must additionally choose data types, representations, termination conditions, and error handling.",
    complexity: "Depends on the chosen algorithm and representation. For numerical methods, convergence and iteration count are part of practical complexity.",
    precision: "Exact mathematics may be replaced by finite machine numbers. Watch rounding, overflow, underflow, cancellation, tolerances, and domain errors.",
    exactVsApprox: "Exact result: represented symbolically or with exact integers/rationals when possible. Approximate result: represented with floating-point numbers or finite iterations.",
    mistakes: "Confusing a mathematical value with its representation; ignoring domain restrictions; assuming floating-point equality; skipping validation of transformed solutions.",
    example: "Choose small valid inputs, execute the definition by hand, then run the equivalent JavaScript and compare the representations.",
    practice: [
      `Explain the definition of ${title} in your own words.`,
      `Work one small example by hand and state every assumption.`,
      `Implement the rule in JavaScript and test an edge case.`
    ],
    related: keywords.split("|").filter(Boolean)
  };
});

// Absurd-but-accurate memory hooks. Kept separate from formal definitions so humor never replaces mathematics.
const IDIOTIC_HOOKS = {
  "Numbers & Number Systems":"Numbers are the universe's LEGO bricks. Integer = whole brick, fraction = brick cut into pieces, irrational = brick with an endless decimal tantrum, complex = a two-coordinate weird brick.",
  "Arithmetic":"Arithmetic is counting with rules. Imagine four pigeons fighting over three samosas: + brings them together, - removes some, × creates repeated groups, ÷ asks how many groups fit.",
  "Fractions":"A fraction is pizza bureaucracy: the bottom says how many equal slices exist, the top says how many slices you stole.",
  "Percentages":"Percent means 'out of 100'. If 20% of your brain is working, congratulations: the other 80% is probably watching the loading spinner.",
  "Variables & Constants":"A variable is a labeled box whose contents can change. A constant is the box whose contents refuse to move because it has signed a contract.",
  "Linear Equations":"An equation is a perfectly balanced seesaw. If you remove 7 from the left, remove 7 from the right, or the mathematical police arrive.",
  "Quadratic Equations":"A quadratic is a parabola wearing an algebra costume. Sometimes it has two answers, one answer, or zero real answers.",
  "Functions":"A function is a vending machine: put x in, press the button, and exactly one output comes out. If it spits out three different snacks for one coin, it is not a function.",
  "Function Composition":"Composition is a mathematical assembly line: function A makes a sandwich, function B eats that sandwich, and the final answer is whatever survives.",
  "Limits":"A limit asks, 'Where are you heading?' not 'Did you actually arrive?' Like walking toward the fridge while insisting you are only going to look.",
  "Derivatives":"A derivative is the speedometer of mathematics. It tells you how violently the output is changing right now.",
  "Chain Rule":"The chain rule says nested functions are onion mathematics: peel one layer, account for it, then peel the next.",
  "Definite Integrals":"An integral is mathematical vacuuming: collect tiny pieces of area until the entire interval has been sucked into one number.",
  "Gradient":"The gradient is a hill's angry arrow saying, 'UP THIS WAY!' Optimization usually walks in the opposite direction because it wants to go downhill.",
  "Matrices":"A matrix is a spreadsheet that went to university and came back with opinions about linear transformations.",
  "Matrix Multiplication":"Matrix multiplication is not normal multiplication. It is a very specific handshake between rows and columns. Mess up the handshake and mathematics throws you out.",
  "Eigenvalues & Eigenvectors":"An eigenvector is the vector that gets shoved by a transformation but stubbornly keeps pointing in the same direction. The eigenvalue tells how much it got stretched or squashed.",
  "Probability":"Probability is mathematics admitting, 'I don't know what will happen, but I can measure my uncertainty.'",
  "Expected Value":"Expected value is the long-run average of a random game. It does NOT promise that today's unlucky pigeon will receive the average outcome.",
  "Variance & Standard Deviation":"Variance measures how spread out the data is. Standard deviation is variance after taking it out of its squared costume.",
  "Bayes' Theorem":"Bayes is the mathematical detective: start with a suspicion, find evidence, then update how suspicious you should be.",
  "Recursion":"Recursion is a function calling itself while holding a smaller problem. It is basically saying, 'I can solve this, but first let me make a tiny copy of my headache.'",
  "Factorials":"n! means multiply all positive integers down to 1. Five factorial is five people entering an elevator and asking how many possible ordering arrangements exist.",
  "Permutations":"Permutations care about order. ABC and BAC are different because mathematics is apparently very picky about seating arrangements.",
  "Combinations":"Combinations do not care about order. Choosing A, B, C is the same team as choosing C, A, B. Nobody cares who entered the room first.",
  "Graphs":"A graph is dots connected by lines. Congratulations: you have reinvented a city map, social network, and many computer algorithms with a handful of dots.",
  "Shortest Paths":"Shortest path asks which route gets you there with the least total cost. It is Google Maps after drinking a mathematics textbook.",
  "Modular Arithmetic":"Modular arithmetic is clock mathematics. After 12, the numbers say, 'Nope, back to 1.'",
  "Floating-Point Numbers":"Floating-point numbers are computers saying, 'I can store approximately 0.1, please do not ask me to explain why three 0.1s may not behave like your school notebook.'",
  "Gradient Descent":"Gradient descent is walking downhill while repeatedly asking, 'Which direction makes the number smaller?' Very sophisticated. Also basically a confused hiker.",
  "Dynamic Programming":"Dynamic programming means stop solving the same stupid subproblem 900 times. Solve it once, remember it, and reuse the answer.",
  "Ordinary Differential Equations":"An ODE describes how something changes. Instead of asking where the car is, it often starts by describing how the car's position changes.",
  "Complex Numbers":"Complex numbers are not 'fake numbers'. They are numbers with an imaginary component because real numbers alone refused to cooperate with equations like x² + 1 = 0.",
  "Sets":"A set is a mathematical bag of distinct objects. If you put the same sock into the bag five times, the set says, 'Cute, but that is still one sock.'",
  "Boolean Algebra":"Boolean algebra is mathematics with only two moods: TRUE and FALSE. It is the world's smallest emotional support system.",
  "Entropy":"Entropy measures uncertainty/information. A completely predictable message is boring; a surprising message carries more information.",
  "Convolution":"Convolution is sliding one pattern across another and repeatedly multiplying-and-adding. It is a mathematical windshield wiper for signals.",
  "Fourier Transform":"Fourier analysis says a complicated signal can be treated as a crowd of simple waves. Mathematics basically opens a song and asks, 'Which frequencies are hiding in here?'",
  "Taylor Series":"Taylor series approximates a function using a pile of derivatives. It is mathematics building a complicated machine out of increasingly detailed local Lego pieces.",
  "Newton-Raphson":"Newton's method repeatedly guesses a root, draws a tangent, and lets the tangent make the next guess. It is educated guessing with calculus.",
  "Lagrange Multipliers":"Lagrange multipliers solve constrained optimization by introducing another variable whose job is essentially to stand nearby and yell, 'Remember the constraint!'",
  "Nash Equilibrium":"A Nash equilibrium is a situation where nobody can improve their payoff by changing strategy alone. Everyone is stuck thinking, 'If THEY won't move, why should I?'",
  "Backpropagation":"Backpropagation is the chain rule marching backward through a computational graph, assigning blame to earlier parameters for the final error.",
  "Automatic Differentiation":"Automatic differentiation tracks tiny derivative bookkeeping through the operations your program actually performs. It is calculus with a clipboard.",
  "Principal Component Analysis":"PCA rotates the data so the first direction captures as much variation as possible. Imagine a messy cloud of points and a very bossy arrow saying, 'Everyone line up this way.'",
  "Topological Spaces":"Topology studies what counts as 'nearby' without caring about exact ruler distances. Imagine stretching a rubber sheet while refusing to tear it.",
  "Compactness":"Compactness is a mathematical way of saying certain infinite-looking behavior can still be controlled by finite information. Infinite nonsense, but organized.",
  "Groups":"A group is a collection of operations that follows strict rules. Think of it as a club where identity, inverses, and associativity are the bouncers.",
  "Category Theory":"Category theory studies objects through the arrows between them. Instead of obsessing over every object's internal organs, it asks how things connect.",
  "Brownian Motion":"Brownian motion is random movement with continuous-time mathematics. Picture a microscopic drunk ant wandering around while probability writes down its autobiography.",
  "Markov Chains":"A Markov process remembers only the current state, not the entire dramatic history. The future says, 'I don't care what happened five minutes ago.'",
  "Cryptography":"Cryptography turns mathematical structure into controlled secrecy. The computer gets a puzzle so difficult that unauthorized readers hopefully give up before the coffee gets cold."
};
function idiotHook(title, summary){
  if(IDIOTIC_HOOKS[title]) return IDIOTIC_HOOKS[title];
  const clean=summary.replace(/\.$/,"");
  return `Think of “${title}” as a weird machine. ${clean}. The machine's job is to follow precise rules; the silly mental picture is only there to help your brain remember those rules.`;
}
