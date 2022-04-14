"use strict";

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
        const fromPos = imports.map(it => sourceCode.getText(it).indexOf("from"));
        if (new Set(fromPos).size >= 1) {
            // need fix
            const longest = Math.max(...fromPos);

            for (let i = 0; i < imports.length; i++) {
                if (fromPos[i] !== longest) {
                    ctx.report({
                        fix: fixer => fixer.replaceTextRange([fromPos[i] - 1, fromPos[i]], " ".repeat(longest - fromPos[i] + 1)),
                        message: "Expected import statement \"from\" keyword to be aligned with any others.",
                        node: imports[i],
                        loc: imports[i].loc,
                    });
                }
            }
        }

        return {};
    }
};