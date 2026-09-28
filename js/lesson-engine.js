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
