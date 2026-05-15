#!/usr/bin/env node

/**
 * Comprehensive Dependency Analysis Tool for React Native Packages
 * Analyzes:
 * 1. Code dependencies (imports in source code)
 * 2. Package dependencies (from package.json)
 * 3. Knowledge dependencies (co-change patterns from git history)
 * 4. Metrics: in-degree, out-degree, centrality
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGES_DIR = path.join(__dirname, 'packages', 'react-native');
const ANALYSIS_OUTPUT = path.join(__dirname, 'DEPENDENCY_ANALYSIS.md');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getAllFiles(dir, ext = '.ts,.tsx,.js,.jsx') {
  const extensions = ext.split(',').map(e => e.trim());
  let files = [];

  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith('.') &&
        item !== 'node_modules' &&
        item !== 'dist' &&
        item !== 'build'
      ) {
        files = files.concat(getAllFiles(fullPath, ext));
      } else if (stat.isFile() && extensions.some(ext => fullPath.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (e) {
    // ignore
  }

  return files;
}

function getPackageName(filePath) {
  const relative = path.relative(PACKAGES_DIR, filePath);
  const parts = relative.split(path.sep);
  return parts[0];
}

function extractImports(fileContent) {
  const imports = [];
  
  // Match: import X from 'module' or import X from "module"
  const importRegex = /import\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  // Match: require('module') or require("module")
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = requireRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  return [...new Set(imports)];
}

function isInternalPackage(importPath) {
  // Check if it's importing from another package in the monorepo
  // e.g., '@react-native/xxx' or 'react-native'
  if (importPath.startsWith('.')) return false;
  if (importPath.startsWith('@react-native')) return true;
  if (importPath === 'react-native') return true;
  return false;
}

function normalizePackageName(importPath) {
  if (importPath.startsWith('@react-native/')) {
    return importPath.substring('@react-native/'.length);
  }
  return importPath;
}

// ============================================================================
// ANALYSIS 1: CODE DEPENDENCIES (SOURCE CODE IMPORTS)
// ============================================================================

function analyzeCodeDependencies() {
  console.log('Analyzing code dependencies from source files...');
  
  const codeDeps = {};
  const packageDirs = fs.readdirSync(PACKAGES_DIR).filter(name => {
    return fs.statSync(path.join(PACKAGES_DIR, name)).isDirectory() &&
           !name.startsWith('.');
  });

  for (const pkgDir of packageDirs) {
    const pkgPath = path.join(PACKAGES_DIR, pkgDir);
    const files = getAllFiles(pkgPath);

    codeDeps[pkgDir] = {
      internalDeps: new Set(),
      externalDeps: new Set(),
      fileCount: files.length,
      imports: {}
    };

    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const imports = extractImports(content);

        codeDeps[pkgDir].imports[path.relative(pkgPath, filePath)] = imports;

        for (const imp of imports) {
          if (isInternalPackage(imp)) {
            const normalized = normalizePackageName(imp);
            codeDeps[pkgDir].internalDeps.add(normalized);
          } else if (!imp.startsWith('.')) {
            codeDeps[pkgDir].externalDeps.add(imp);
          }
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  }

  return codeDeps;
}

// ============================================================================
// ANALYSIS 2: PACKAGE DEPENDENCIES (PACKAGE.JSON)
// ============================================================================

function analyzePackageDependencies() {
  console.log('Analyzing package.json dependencies...');
  
  const pkgDeps = {};
  const packageDirs = fs.readdirSync(PACKAGES_DIR).filter(name => {
    return fs.statSync(path.join(PACKAGES_DIR, name)).isDirectory() &&
           !name.startsWith('.');
  });

  for (const pkgDir of packageDirs) {
    const pkgJsonPath = path.join(PACKAGES_DIR, pkgDir, 'package.json');
    
    pkgDeps[pkgDir] = {
      dependencies: [],
      devDependencies: [],
      peerDependencies: [],
      monorepoDeps: []
    };

    if (!fs.existsSync(pkgJsonPath)) continue;

    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      
      const allDeps = {
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
        ...pkgJson.peerDependencies
      };

      for (const [dep, version] of Object.entries(allDeps)) {
        if (dep.startsWith('@react-native') || dep === 'react-native') {
          const normalized = normalizePackageName(dep);
          pkgDeps[pkgDir].monorepoDeps.push(normalized);
        } else if (pkgJson.dependencies && pkgJson.dependencies[dep]) {
          pkgDeps[pkgDir].dependencies.push(dep);
        } else if (pkgJson.devDependencies && pkgJson.devDependencies[dep]) {
          pkgDeps[pkgDir].devDependencies.push(dep);
        } else if (pkgJson.peerDependencies && pkgJson.peerDependencies[dep]) {
          pkgDeps[pkgDir].peerDependencies.push(dep);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  return pkgDeps;
}

// ============================================================================
// ANALYSIS 3: KNOWLEDGE DEPENDENCIES (CO-CHANGE PATTERNS)
// ============================================================================

function analyzeCoChanges() {
  console.log('Analyzing co-change patterns from git history...');
  
  const coChanges = {};
  
  try {
    // Get git log with file changes in packages directory
    // Using git -5000 to get recent commits (works on Windows)
    const gitLog = execSync(
      `git log -5000 --pretty=format:"%H" --name-only -- packages/`,
      { cwd: __dirname, encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
    );

    const commits = gitLog.split('\n\n').filter(c => c.trim());
    const changeMatrix = {};

    for (const commit of commits) {
      const lines = commit.split('\n').filter(l => l.trim());
      if (lines.length < 2) continue;

      // Extract package names from file paths
      const filesInCommit = lines.slice(1).map(filePath => {
        const match = filePath.match(/^packages\/([^/]+)\//);
        return match ? match[1] : null;
      }).filter(Boolean);

      const uniquePackages = [...new Set(filesInCommit)];

      // Record co-changes
      for (let i = 0; i < uniquePackages.length; i++) {
        for (let j = i + 1; j < uniquePackages.length; j++) {
          const pair = [uniquePackages[i], uniquePackages[j]].sort().join('|');
          changeMatrix[pair] = (changeMatrix[pair] || 0) + 1;
        }
      }
    }

    // Convert to structured format
    const allPackages = new Set();
    for (const pair of Object.keys(changeMatrix)) {
      pair.split('|').forEach(p => allPackages.add(p));
    }

    for (const pkg of allPackages) {
      coChanges[pkg] = {};
    }

    for (const [pair, count] of Object.entries(changeMatrix)) {
      if (count > 0) {
        const [pkg1, pkg2] = pair.split('|');
        coChanges[pkg1][pkg2] = count;
        coChanges[pkg2][pkg1] = count;
      }
    }

    return { changeMatrix, coChanges };
  } catch (e) {
    console.log('⚠️  Could not analyze git history:', e.message);
    return { changeMatrix: {}, coChanges: {} };
  }
}

// ============================================================================
// ANALYSIS 4: CALCULATE METRICS
// ============================================================================

function calculateMetrics(codeDeps, pkgDeps) {
  console.log('Calculating dependency metrics...');
  
  const metrics = {};

  for (const pkg of Object.keys(codeDeps)) {
    const inDegree = Object.values(codeDeps).filter(
      dep => dep.internalDeps.has(pkg)
    ).length;

    const outDegree = codeDeps[pkg].internalDeps.size;
    
    metrics[pkg] = {
      inDegree,
      outDegree,
      totalDegree: inDegree + outDegree,
      centralityScore: (outDegree * 2 + inDegree) / 3,
      fileCount: codeDeps[pkg].fileCount,
      externalDepsCount: codeDeps[pkg].externalDeps.size,
      isCore: outDegree > 5 || inDegree > 5
    };
  }

  return metrics;
}

// ============================================================================
// ANALYSIS 5: IDENTIFY INCONSISTENCIES
// ============================================================================

function findInconsistencies(codeDeps, pkgDeps, coChanges) {
  console.log('Finding inconsistencies...');
  
  const inconsistencies = [];

  // Check 1: Imported but not declared as dependency
  for (const [pkg, deps] of Object.entries(codeDeps)) {
    for (const imported of deps.internalDeps) {
      if (imported === pkg) continue; // Skip self
      const declared = (pkgDeps[pkg]?.monorepoDeps || []).includes(imported);
      if (!declared && imported !== 'react-native') {
        inconsistencies.push({
          type: 'IMPORTED_NOT_DECLARED',
          package: pkg,
          imported,
          severity: 'HIGH'
        });
      }
    }
  }

  // Check 2: Declared but not imported
  for (const [pkg, deps] of Object.entries(pkgDeps)) {
    for (const declared of deps.monorepoDeps) {
      if (declared === pkg) continue; // Skip self
      const isImported = codeDeps[pkg]?.internalDeps?.has(declared);
      if (!isImported) {
        inconsistencies.push({
          type: 'DECLARED_NOT_IMPORTED',
          package: pkg,
          declared,
          severity: 'MEDIUM'
        });
      }
    }
  }

  // Check 3: Co-changed but no code dependency
  for (const [pair, count] of Object.entries(coChanges.changeMatrix)) {
    if (count > 3) {
      const [pkg1, pkg2] = pair.split('|');
      const codeLinked = codeDeps[pkg1]?.internalDeps?.has(pkg2) ||
                        codeDeps[pkg2]?.internalDeps?.has(pkg1);
      if (!codeLinked) {
        inconsistencies.push({
          type: 'CO_CHANGED_NO_CODE_DEP',
          packages: [pkg1, pkg2],
          coChangeCount: count,
          severity: 'MEDIUM'
        });
      }
    }
  }

  return inconsistencies;
}

// ============================================================================
// MAIN ANALYSIS
// ============================================================================

function runAnalysis() {
  console.log('Starting comprehensive dependency analysis...\n');

  const codeDeps = analyzeCodeDependencies();
  const pkgDeps = analyzePackageDependencies();
  const coChangeData = analyzeCoChanges();
  const metrics = calculateMetrics(codeDeps, pkgDeps);
  const inconsistencies = findInconsistencies(codeDeps, pkgDeps, coChangeData);

  console.log('Analysis complete!\n');

  return {
    codeDeps,
    pkgDeps,
    coChangeData,
    metrics,
    inconsistencies,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateReport(analysis) {
  const {
    codeDeps,
    pkgDeps,
    coChangeData,
    metrics,
    inconsistencies,
    timestamp
  } = analysis;

  let report = `# React Native Packages - Dependency Analysis Report

**Generated:** ${timestamp}

---

## Executive Summary

This report analyzes **code-level dependencies** and **knowledge dependencies** (co-change patterns) across ${Object.keys(metrics).length} packages in the React Native monorepo.

### Key Findings

- **Total Packages:** ${Object.keys(metrics).length}
- **Total Internal Dependencies:** ${Object.values(metrics).reduce((sum, m) => sum + m.outDegree, 0)}
- **Inconsistencies Found:** ${inconsistencies.length}
- **Core Packages (high centrality):** ${Object.entries(metrics).filter(([, m]) => m.isCore).map(([p]) => p).join(', ')}

---

## Section 1: Code Dependencies Analysis

### 1.1 Dependency Metrics Summary

| Package | Files | Out-Degree | In-Degree | Centrality | Core? |
|---------|-------|-----------|-----------|-----------|-------|
`;

  // Sort by centrality score descending
  const sortedPkgs = Object.entries(metrics).sort((a, b) => 
    b[1].centralityScore - a[1].centralityScore
  );

  for (const [pkg, m] of sortedPkgs) {
    const core = m.isCore ? '✓' : '-';
    report += `| ${pkg} | ${m.fileCount} | ${m.outDegree} | ${m.inDegree} | ${m.centralityScore.toFixed(2)} | ${core} |\n`;
  }

  report += `

### 1.2 Packages with Most Dependencies (Out-Degree)

These packages import heavily from other packages:

`;

  const mostDepsOut = sortedPkgs
    .sort((a, b) => b[1].outDegree - a[1].outDegree)
    .slice(0, 10);

  for (const [pkg, m] of mostDepsOut) {
    report += `
**${pkg}** (${m.outDegree} dependencies)
- Files: ${m.fileCount}
- Imports from: ${Array.from(codeDeps[pkg].internalDeps).join(', ')}
`;
  }

  report += `

### 1.3 Packages with Most Dependents (In-Degree)

These packages are most relied upon by others:

`;

  const mostDepsIn = sortedPkgs
    .sort((a, b) => b[1].inDegree - a[1].inDegree)
    .slice(0, 10);

  for (const [pkg, m] of mostDepsIn) {
    const dependents = Object.entries(codeDeps)
      .filter(([, deps]) => deps.internalDeps.has(pkg))
      .map(([p]) => p);
    report += `
**${pkg}** (${m.inDegree} dependents)
- Used by: ${dependents.join(', ')}
`;
  }

  report += `

### 1.4 Packages with Least Dependencies (Leaf Packages)

These packages have minimal dependencies on others (good for testing/modularity):

`;

  const leastDepsOut = sortedPkgs
    .sort((a, b) => a[1].outDegree - b[1].outDegree)
    .slice(0, 10);

  for (const [pkg, m] of leastDepsOut) {
    report += `- **${pkg}** (${m.fileCount} files, ${m.outDegree} deps, ${m.inDegree} dependents)\n`;
  }

  report += `

---

## Section 2: Dependency Graph Analysis

### 2.1 Internal Dependency Relationships

`;

  for (const [pkg, m] of sortedPkgs.slice(0, 15)) {
    if (m.outDegree > 0 || m.inDegree > 0) {
      report += `
**${pkg}**
- Out-degree: ${m.outDegree} → Imports: ${Array.from(codeDeps[pkg].internalDeps).join(', ') || 'none'}
- In-degree: ${m.inDegree} → Imported by: ${Object.entries(codeDeps).filter(([, d]) => d.internalDeps.has(pkg)).map(([p]) => p).join(', ') || 'none'}
`;
    }
  }

  report += `

---

## Section 3: Knowledge Dependencies (Co-Change Analysis)

Co-change patterns show which files are frequently modified together, indicating logical or functional coupling:

### 3.1 Most Frequent Co-Changes

`;

  const sortedChanges = Object.entries(coChangeData.changeMatrix)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  for (const [pair, count] of sortedChanges) {
    const [pkg1, pkg2] = pair.split('|');
    const hasCodeDep = codeDeps[pkg1]?.internalDeps?.has(pkg2) ||
                      codeDeps[pkg2]?.internalDeps?.has(pkg1);
    const indicator = hasCodeDep ? '✓' : '✗';
    report += `- **${pkg1}** ↔ **${pkg2}**: ${count} commits [Code Dep: ${indicator}]\n`;
  }

  report += `

### 3.2 Analysis & Interpretation

**Co-Change Significance:**
- **High frequency (>5)**: Strong coupling - likely indicates:
  - Related functionality
  - Shared concerns or domain
  - Potential for integration issues if changed independently

**Code Dependency Alignment:**
- ✓ = Code and knowledge dependencies aligned (expected)
- ✗ = Co-changed but no code dependency (indicates hidden coupling)

---

## Section 4: Inconsistencies & Anomalies

### 4.1 Critical Issues

Inconsistencies indicate potential problems in the dependency structure:

`;

  const criticalIssues = inconsistencies.filter(i => i.severity === 'HIGH');
  const mediumIssues = inconsistencies.filter(i => i.severity === 'MEDIUM');

  if (criticalIssues.length > 0) {
    report += `**${criticalIssues.length} CRITICAL ISSUES FOUND**\n\n`;
    for (const issue of criticalIssues) {
      if (issue.type === 'IMPORTED_NOT_DECLARED') {
        report += `- ⚠️ **${issue.package}** imports **${issue.imported}** but doesn't declare it in package.json\n`;
      }
    }
  } else {
    report += `No critical issues found. ✓\n\n`;
  }

  report += `

### 4.2 Medium-Severity Issues

${mediumIssues.length > 0 ? mediumIssues.map(issue => {
    if (issue.type === 'DECLARED_NOT_IMPORTED') {
      return `- **${issue.package}** declares **${issue.declared}** as dependency but doesn't import it`;
    } else if (issue.type === 'CO_CHANGED_NO_CODE_DEP') {
      return `- **${issue.packages[0]}** and **${issue.packages[1]}** changed together ${issue.coChangeCount} times but have no code dependency`;
    }
  }).join('\n') : 'No medium-severity issues found. ✓'}

---

## Section 5: Methodology & Tools

### 5.1 Analysis Methods

1. **Code Dependencies Analysis**
   - Method: Static analysis of import/require statements in source files
   - Files scanned: All .ts, .tsx, .js, .jsx files in packages/*/src
   - Import patterns: \`import X from 'module'\` and \`require('module')\`
   - Internal packages: Detected via @react-native/* and react-native prefixes

2. **Package Dependencies Analysis**
   - Method: Parsing package.json dependencies, devDependencies, peerDependencies
   - Monorepo packages: Identified by @react-native/* and react-native scopes

3. **Knowledge Dependencies Analysis**
   - Method: Git history analysis - files modified in same commit
   - Analysis window: Last 500 commits in packages/
   - Threshold: Minimum 1 co-change recorded

4. **Inconsistency Detection**
   - Imported but not declared: Code imports ≠ package.json dependencies
   - Declared but not imported: package.json dependencies not used in code
   - Co-changed but uncoupled: Git history shows coupling, but no code dependency

### 5.2 Metrics Definitions

- **Out-Degree**: Number of other packages this package imports from
- **In-Degree**: Number of packages that import from this package
- **Centrality Score**: (OutDegree × 2 + InDegree) / 3 - measures influence
- **Core Package**: Out-degree > 5 OR In-degree > 5

### 5.3 Limitations

- Analysis based on syntactic patterns; may miss dynamic imports
- Git analysis limited to recent commits (500)
- File paths matching heuristics may miss some dependencies
- Type-level dependencies not analyzed (TypeScript types)

---

## Section 6: Recommendations

### 6.1 For Architecture

1. **Reduce Core Package Complexity**: Break down high out-degree packages
2. **Stabilize Core Abstractions**: Packages with high in-degree should be stable
3. **Decouple Co-Changed Packages**: If co-changed but uncoupled, may need refactoring

### 6.2 For Development

1. **Align Dependencies**: Fix declared-but-unused dependencies (clean dependencies)
2. **Document Hidden Coupling**: Update package.json for detected-but-undeclared imports
3. **Test Co-Changed Packages**: Treat co-changed package pairs as units in testing

---

## Appendix: Raw Dependency Matrix

### Internal Dependencies by Package

\`\`\`
`;

  for (const [pkg, m] of sortedPkgs) {
    if (codeDeps[pkg].internalDeps.size > 0) {
      report += `${pkg} → [${Array.from(codeDeps[pkg].internalDeps).join(', ')}]\n`;
    }
  }

  report += `\`\`\`

---

*Report generated automatically. For updates, re-run: node analyze-dependencies.js*
`;

  return report;
}

// ============================================================================
// EXECUTION
// ============================================================================

const analysis = runAnalysis();
const report = generateReport(analysis);

fs.writeFileSync(ANALYSIS_OUTPUT, report);
console.log(`Report written to: ${ANALYSIS_OUTPUT}`);
console.log(`\n Summary:`);
console.log(`   - Packages analyzed: ${Object.keys(analysis.metrics).length}`);
console.log(`   - Inconsistencies: ${analysis.inconsistencies.length}`);
console.log(`   - High severity: ${analysis.inconsistencies.filter(i => i.severity === 'HIGH').length}`);
console.log(`   - Medium severity: ${analysis.inconsistencies.filter(i => i.severity === 'MEDIUM').length}`);
