*** Settings ***
Library    SeleniumLibrary

Suite Setup       Dado que o usuário acessa a tela de login
Suite Teardown    E fecha o navegador

*** Variables ***
${URL}                 http://localhost:5173/login
${BROWSER}             chrome

${INPUT_EMAIL}         id=email
${INPUT_SENHA}         id=password
${BOTAO_LOGIN}         id=btnLogin
${MENSAGEM}            id=mensagemErro

*** Test Cases ***
CT01 - Deve realizar login com sucesso
    Dado que o usuário informa o email    maria@email.com
    E informa a senha    SenhaSegura123
    Quando solicitar o login
    Então o sistema deve apresentar a mensagem    Login efetuado com sucesso

CT02 - Deve validar email obrigatório
    Dado que o usuário informa o email    
    E informa a senha    SenhaSegura123
    Quando solicitar o login
    Então o sistema deve apresentar a mensagem    E-mail obrigatório.

CT03 - Deve validar senha obrigatória
    Dado que o usuário informa o email    maria@email.com
    E informa a senha    
    Quando solicitar o login
    Então o sistema deve apresentar a mensagem    Senha obrigatória.

CT04 - Deve validar credenciais incorretas
    Dado que o usuário informa o email    maria@email.com
    E informa a senha    SenhaErrada
    Quando solicitar o login
    Então o sistema deve apresentar a mensagem    E-mail ou senha incorretos.

*** Keywords ***
Dado que o usuário acessa a tela de login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Dado que o usuário informa o email
    [Arguments]    ${email}=${EMPTY}
    Input Text    ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}=${EMPTY}
    Input Password    ${INPUT_SENHA}    ${senha}

Quando solicitar o login
    Click Button    ${BOTAO_LOGIN}

Então o sistema deve apresentar a mensagem
    [Arguments]    ${mensagem}
    Element Text Should Be    ${MENSAGEM}    ${mensagem}

E fecha o navegador
    Close Browser
