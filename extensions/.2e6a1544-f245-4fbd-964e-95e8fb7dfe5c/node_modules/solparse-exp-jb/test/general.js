"use strict";
const assert = require("chai").assert;
const SolidityParser = require("../index.js");
const fs = require("fs");
const path = require('path');


describe("Parses test.sol", function() {
    it("parses test.sol as the antlr", function() {
        try{
            let all =  SolidityParser.parseFile("./test/test.sol", true);
            let x = all;
        }
        catch(error){
            console.log("./test/test.sol", error.message);
            let x = error;
        }
       
    });
});


describe("Parse oss repos", function() {
    it("parses all oss repos", function() {
        //var repos = ['prb-math', 'openzeppelin-contracts', 'openzeppelin-contracts-upgradeable', 'solmate', 'seaport']
        var repos = ['openzeppelin-contracts-upgradeable']
        for (let x = 0; x < repos.length; x++) {
            const repo = repos[x];
        
        
            var files = fromDir('../' + repo, '.sol');
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                try{
                    let all =  SolidityParser.parseFile(file);
                    console.log(file);
                    let x = all;
                }
                catch(error){
                    let x = error;
                    console.log(file, error.message);
                }
                
            }
        }
       
    });
});



describe("Parser ERC20", function() {
    it("parses Erc20 example without throwing an error", function() {
        try{
            let all =  SolidityParser.parseFile("./test/ERC20.sol", false);
            let x = all;
        }
        catch(error){
            let x = error;
            throw x;
        }
    });
});


describe("Parser", function() {
    it("parses documentation examples without throwing an error", function() {
        SolidityParser.parseFile("./test/doc_examples.sol", true);
    });

    it("parses documentation examples using imports parser without throwing an error", function() {
       // SolidityParser.parseFile("./test/doc_examples.sol", "imports", true);
    });
});

describe("Built Parser", function() {
    it("parses documentation examples without throwing an error", function() {
        SolidityParser.parseFile("./test/doc_examples.sol", false);
    });

    it("parses documentation examples using imports parser without throwing an error", function() {
        SolidityParser.parseFile("./test/doc_examples.sol", "imports", false);
    });
});


describe("Should parse pragma abicoder", function() {
    it("parses abi coder with v2", function() {
        try{
            let all =  SolidityParser.parseFile("./test/doc_examples.sol", false);
            let body = all.body;
            for (let i = 0; i < body.length; i++) {
                    if(body[i].type === "AbiCoderPragmaStatement") {
                        assert.isTrue(body[i].version.name === "v2");
                    }
                }
        }catch(e) {
            x = e;
            throw x;
        }
    });
});


describe("Should do try parse", function() {
    it("shoud be able to parse try catch in multiple contracts", function() {
        try{
            let all =  SolidityParser.parseFile("./test/tryparse-contract.sol", false);
            let body = all.body;
        }catch(e) {
            x = e;
            throw e;
        }
    });
});

describe("Should do try parse generic", function() {
    it("shoud be able to parse try catch ", function() {
        try{
            let all =  SolidityParser.parseFile("./test/tryparse-generic.sol", false);
            let body = all.body;
        }catch(e) {
            x = e;
            throw e;
        }
    });
});


describe("Should parse error declaration", function() {
    it("shoud be able to parse error declarations ", function() {
        try{
            let all =  SolidityParser.parseFile("./test/parse-errordeclarations.sol", false);
            let body = all.body;
        }catch(e) {
            x = e;
            throw e;
        }
    });
});

describe("Should handle incomplete stametements", function() {
    it("should be able to get position of error", function() {
 
            let all =  SolidityParser.parseFile("./test/example_incomplete.sol", false);
            let body = all.body;
            for (let i = 0; i < body.length; i++) {
                    if(body[i].type === "ContractStatement") {
                        assert.isTrue(body[i].body[5].type === "ConstructorDeclaration");
                        assert.isTrue(body[i].body[5].body.body[0].type === "IncompleteStatement");
                    }
            } 
    });
});


describe("Should parse constructor, receive and fallback", function() {
    it("parses contracts with constructor, receive and fallback", function() {
       let all =  SolidityParser.parseFile("./test/doc_examples.sol", false);
       let body = all.body;
       for (let i = 0; i < body.length; i++) {
            if(body[i].type === "ContractStatement" && body[i].name ==="receive_fallback_constructor") {
                    assert.isTrue(body[i].body[1].type === "ConstructorDeclaration");
                    assert.isTrue(body[i].body[2].type === "ReceiveDeclaration");
                    assert.isTrue(body[i].body[3].type === "FallbackDeclaration");
            }
        }
    });
});

describe("Should parse abstract", function() {
    it("parses contracts with abstract", function() {
       let all =  SolidityParser.parseFile("./test/doc_examples.sol", false);
       let body = all.body;
       for (let i = 0; i < body.length; i++) {
           if(body[i].type === "ContractStatement" && body[i].name ==="testAbstract") {
               assert.isTrue(body[i].is_abstract);
           }

           if(body[i].type === "ContractStatement" && body[i].name !=="testAbstract") {
               assert.isFalse(body[i].is_abstract);
           }
       }
    });
});


describe("Should parse numbers with underscores", function() {
    it("parses contracts with underscores", function() {
       let all =  SolidityParser.parseFile("./test/doc_examples.sol", false);
       let body = all.body;
       for (let i = 0; i < body.length; i++) {
           if(body[i].type === "ContractStatement" && body[i].name ==="NumbersWithUnderscorers") {
               assert.isTrue(body[i].body[0].value.value === 10000000);
           }
       }
    });
});

describe("Parse comments", () => {
    function isAValidCommentToken(c, sc) {
        return (
            ["Line", "Block"].includes(c.type) && typeof c.text === "string" &&
            (c.text.startsWith("//") || c.text.startsWith("/*")) && Number.isInteger(c.start) &&
            Number.isInteger(c.end) && sc.slice(c.start, c.end) === c.text
        );
    }

    it("should parse comments", () => {
        const sourceCode = require("fs").readFileSync("./test/doc_examples.sol", "utf8");
        const comments = SolidityParser.parseComments(sourceCode);

        const expectedCommLen = 64;

        if (comments.length !== expectedCommLen) {
            throw new Error(`there should be ${expectedCommLen} comment objects`);
        }

        comments.forEach(com => {
            if (!isAValidCommentToken(com, sourceCode)) {
                throw new Error(`${com} is not a valid comment token.`);
            }
        });
    });
});




function fromDir(startPath, filter) {

    var results = []
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return results;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            results = results.concat(fromDir(filename, filter)); //recurse
        } else if (filename.endsWith(filter)) {
            results.push(filename);
        };
    };
    return results;
};

