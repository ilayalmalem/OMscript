function compile(code) {
    var expressions = code.trim().match(/\w+|./g)
    expressions = expressions.filter(function(v){return v.trim().length});
    code = code.trim()
    const runtime = {
        varaibles: []
    }
    const stack = []
    const primitives = [
        'int',
        'string',
        'bool'
    ]
    const specials = [
        '=',
        '{',
        '}',
        '(',
        ')'
    ]

    const setters = [
        'const',
        'let',
        'var'
    ]
    expressions.forEach((exp, index) => {
        if(primitives.includes(exp)) {
            stack.push({
                type: 'TypeDeclaration'
            })
        }
        else if(exp == 'fun') {
            stack.push({
                type: 'FunctionDeclaration'
            })
            stack.push({
                type: 'FunctionName',
                name: expressions[index + 1]
            })
        }

        else if(exp == '(') {
            if(expressions[index - 2] == 'fun') {
                stack.push({
                    type: 'ArgsBlockStart'
                })
                var args = ''
                for (let i = index + 1; expressions[i] !== ')'; i++) {
                    args += expressions[i]
                }
                stack.push({
                    type: 'Arguments',
                    name: args
                },
                {
                    type: 'ArgsBlockEnd'
                })
            }
        }

        else if(exp == '{') {
            stack.push({
                type: 'BlockStart'
            })
            var blockContent = ''
            for (let i = index + 1; expressions[i] !== '}'; i++) {
                blockContent += `${expressions[i]}`
            }
            stack.push({
                type: 'BlockContent',
                content: blockContent
            },
            {
                type: 'BlockEnd'
            })
        }

        else if(setters.includes(exp)) {
            stack.push({
                type: 'Setter',
                setterType: exp
            })
        }
    });
    console.log(expressions)
    console.log(stack)
    var compiled = ''
    stack.forEach(s => {
        switch(s.type) {
            case 'TypeDeclaration':
                break;
            case 'FunctionDeclaration':
                compiled += 'function'
                break;
            case 'FunctionName':
                compiled += ` ${s.name}`
                break;
            case 'ArgsBlockStart':
                compiled += ` (`
                break;
            case 'Arguments':
                compiled += `${s.name}`
                break;
            case 'ArgsBlockEnd':
                compiled += `)`
                break;
            case 'BlockStart':
                compiled += ` {\n`
                break;  
            case 'BlockEnd':
                compiled += `}`
                break;
            case 'BlockContent':
                compiled += `\t ${s.content} \n`
                break;
        }
    })
    console.log(compiled)
}

compile(`
    int fun x(args, six) {
        console.log(2);
        const x = 2;
    };
`)
