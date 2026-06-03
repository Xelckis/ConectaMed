*** Settings ***
Library           SeleniumLibrary

Suite Setup       Open Browser    http://localhost:3000/cadastro    chrome
Suite Teardown    Close Browser

*** Variables ***
${INPUT_NOME}     id=nome
${BOTAO_CADASTRAR}    id=btnCadastrar
${MENSAGEM}       id=mensagem

*** Test Cases ***
CT-UI-06 - Validar nome válido (Classe Válida)
    Input Text    ${INPUT_NOME}    Arthur Moraes
    Click Button    ${BOTAO_CADASTRAR}
    Element Text Should Be    ${MENSAGEM}    Cadastro realizado com sucesso

CT-UI-07 - Validar nome muito curto (Classe Inválida)
    Input Text    ${INPUT_NOME}    Jo
    Click Button    ${BOTAO_CADASTRAR}
    Element Text Should Be    ${MENSAGEM}    Nome muito curto

CT-UI-08 - Validar nome muito longo (Classe Inválida)
    # Gera uma string de 51 caracteres
    ${NOME_LONGO}    Set Variable    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    Input Text    ${INPUT_NOME}    ${NOME_LONGO}
    Click Button    ${BOTAO_CADASTRAR}
    Element Text Should Be    ${MENSAGEM}    Nome muito longo
