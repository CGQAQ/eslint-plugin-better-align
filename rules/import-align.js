"use strict";

const FROM_REG = /\s*from\s*?["']/;
const FROM_END_REG = /from\s*?["']/;

const IMPORT_FROM_REG = /import.*?from\s*["']/;
// const IMPORT_REG = /import\s*["']/;
const IMPORT_PREFIX_LEN = "import ".length;

/**
 * 
 * @param {import("eslint").Rule.RuleFixer} fixer 
 * @param {[Number, Number]} range
 * @param {Number} base 
 * @param {Number} suggested 
 */
function fixImportFrom(fixer, range, base, suggested) {
    // console.log("fix", range, base, suggested);
    if (range[1] - suggested > 0) {
        // need reducing space
        return fixer.removeRange([base + suggested, base + range[1]]);
    } else if (range[1] - suggested < 0) {
        // need adding space
        return fixer.insertTextAfterRange(range.map(it => it + base), " ".repeat(suggested - range[1]));
    } else {
        console.log("no need fix");
    }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "layout",
        fixable: "whitespace",
        schema: [
            {
                enum: ["always", "never"],
            },
        ],
        docs: {
            description: "enforce import statements \"from\" keyword align vertically",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://github.com/CGQAQ/eslint-rule-import-align"
        },
    },

    create(ctx) {
        const options = ctx.options[0] || "always";
        if (options !== "always") {
            return {};
        }

        /** @type {import("eslint").SourceCode} */
        const sourceCode = ctx.getSourceCode();

        const importFroms = sourceCode.ast.body.filter(it => it.type === "ImportDeclaration" && IMPORT_FROM_REG.test(sourceCode.getText(it)) && sourceCode.getText(it).split("\n").length === 1);
        const fromPosPair = importFroms.map(it => [FROM_REG.exec(sourceCode.getText(it)), FROM_END_REG.exec(sourceCode.getText(it)), it.start]);
        const fromPosLeft = fromPosPair.map(it => it[0].index);
        const fromPosRight = fromPosPair.map(it => it[1].index);

        const suggested = Math.max(...fromPosLeft) + 1;
        
        if (new Set(fromPosRight).size >= 1) {
            // need fix
            for (let i = 0; i < importFroms.length; i++) {
                if (fromPosRight[i] !== suggested) {
                    ctx.report({
                        fix: (fixer) => fixImportFrom(fixer, [fromPosLeft[i], fromPosRight[i]], fromPosPair[i][2], suggested),
                        message: "Expected import statement \"from\" keyword to be aligned with any others.",
                        node: importFroms[i],
                    });
                }
            }
        }

        const imports = sourceCode.ast.body.filter(it => it.type === "ImportDeclaration" && !IMPORT_FROM_REG.test(sourceCode.getText(it)) && sourceCode.getText(it).split("\n").length === 1);
        for (let i = 0; i < imports.length; i++) {
            const importText = sourceCode.getText(imports[i]);
            const quotesPos = /["']/.exec(importText).index;

            if (quotesPos > IMPORT_PREFIX_LEN) {
                ctx.report({
                    fix: fixer => fixer.removeRange([imports[i].start + IMPORT_PREFIX_LEN, imports[i].start + quotesPos]),
                    message: "Expected side effect import statement to be aligned with single space",
                    node: imports[i],
                });
            } else if (quotesPos < IMPORT_PREFIX_LEN) {
                ctx.report({
                    fix: fixer => fixer.insertTextAfterRange([imports[i].start + IMPORT_PREFIX_LEN - 1, imports[i].start + IMPORT_PREFIX_LEN - 1], " "),
                    message: "Expected side effect import statement to be aligned with single space",
                    node: imports[i],
                });
            }
        }

        return {};
    }
};