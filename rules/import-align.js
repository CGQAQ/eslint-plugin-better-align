"use strict";

const FROM_REG = /\s*from\s*?"/;
const FROM_END_REG = /from\s*?"/;

/**
 * 
 * @param {import("eslint").Rule.RuleFixer} fixer 
 * @param {[Number, Number]} range
 * @param {Number} base 
 * @param {Number} suggested 
 */
function fix(fixer, range, base, suggested) {
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
    docs: {
        description: "enforce import statements \"from\" keyword align vertically",
        category: "Stylistic Issues",
        recommended: false,
        url: "https://github.com/CGQAQ/eslint-rule-import-align"
    },
    meta: {
        type: "layout",
        fixable: "whitespace",
        schema: [
            {
                enum: ["always", "never"],
            },
        ],
    },

    create(ctx) {
        const options = ctx.options[0] || "always";
        if (options !== "always") {
            return {};
        }

        /** @type {import("eslint").SourceCode} */
        const sourceCode = ctx.getSourceCode();

        const imports = sourceCode.ast.body.filter(it => it.type === "ImportDeclaration");
        const fromPosPair = imports.map(it => [FROM_REG.exec(sourceCode.getText(it)), FROM_END_REG.exec(sourceCode.getText(it)), it.start]);
        const fromPosLeft = fromPosPair.map(it => it[0].index);
        const fromPosRight = fromPosPair.map(it => it[1].index);
        
        if (new Set(fromPosRight).size >= 1) {
            // need fix
            const suggested = Math.max(...fromPosLeft) + 1;

            for (let i = 0; i < imports.length; i++) {
                if (fromPosRight[i] !== suggested) {
                    ctx.report({
                        fix: (fixer) => fix(fixer, [fromPosLeft[i], fromPosRight[i]], fromPosPair[i][2], suggested),
                        message: "Expected import statement \"from\" keyword to be aligned with any others.",
                        node: imports[i],
                    });
                }
            }
        }

        return {};
    }
};