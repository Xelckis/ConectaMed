*** Settings ***
Library           SeleniumLibrary

Suite Setup       Dado que o usuário acessa a tela de cadastro
Suite Teardown    E fecha o navegador

*** Variables ***
${URL}            http://localhost:3000/cadastro
${BROWSER}        chrome
${INPUT_NOME}     id=nome
${INPUT_EMAIL}    id=email
${INPUT_SENHA}    id=senha
${INPUT_CONFIRMAR}    id=confirmarSenha
${BOTAO_CADASTRAR}    id=btnCadastrar
${MENSAGEM}       id=mensagem

*** Test Cases ***
CT01 - Deve realizar cadastro com dados válidos
    Dado que o usuário informa o nome    João Silva
    E informa o email    joao@email.com
    E informa a senha    12345678
    E confirma a senha    12345678
    Quando solicitar o cadastro
    Então o sistema deve apresentar a mensagem    Cadastro realizado com sucesso

CT02 - Deve validar nome obrigatório
    Dado que o usuário informa o nome    ${EMPTY}
    E informa o email    joao@email.com
    E informa a senha    12345678
    E confirma a senha    12345678
    Quando solicitar o cadastro
    Então o sistema deve apresentar a mensagem    Nome obrigatório

CT03 - Deve validar email inválido
    Dado que o usuário informa o nome    João Silva
    E informa o email    joaoemail.com
    E informa a senha    12345678
    E confirma a senha    12345678
    Quando solicitar o cadastro
    Então o sistema deve apresentar a mensagem    Email inválido

CT04 - Deve validar senha inválida
    Dado que o usuário informa o nome    João Silva
    E informa o email    joao@email.com
    E informa a senha    123
    E confirma a senha    123
    Quando solicitar o cadastro
    Então o sistema deve apresentar a mensagem    Senha inválida

CT05 - Deve validar divergência entre senhas
    Dado que o usuário informa o nome    João Silva
    E informa o email    joao@email.com
    E informa a senha    12345678
    E confirma a senha    87654321
    Quando solicitar o cadastro
    Então o sistema deve apresentar a mensagem    Senhas diferentes

*** Keywords ***
Dado que o usuário acessa a tela de cadastro
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

E fecha o navegador
    Close Browser

Dado que o usuário informa o nome
    [Arguments]    ${nome}
    Input Text    ${INPUT_NOME}    ${nome}

E informa o email
    [Arguments]    ${email}
    Input Text    ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}
    Input Password    ${INPUT_SENHA}    ${senha}

E confirma a senha
    [Arguments]    ${confirmar}
    Input Password    ${INPUT_CONFIRMAR}    ${confirmar}

Quando solicitar o cadastro
    Click Button    ${BOTAO_CADASTRAR}

Então o sistema deve apresentar a mensagem
    [Arguments]    ${mensagem}
    Element Text Should Be    ${MENSAGEM}    ${mensagem}
