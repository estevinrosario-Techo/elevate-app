@echo off
chcp 65001 >nul
echo ================================================
echo   ELEVATE APP - Subir a GitHub automaticamente
echo ================================================
echo.

:: Verificar que estamos en la carpeta correcta
if not exist "package.json" (
    echo ERROR: Ejecuta este archivo DENTRO de la carpeta elevate-app
    echo Arrastra este .bat a la carpeta elevate-app y vuelve a ejecutarlo
    pause
    exit /b 1
)

:: Pedir el token
echo Por favor ingresa tu GitHub Personal Access Token:
echo (El texto no se mostrara mientras escribes - presiona Enter al terminar)
echo.
set /p TOKEN="Token: "

if "%TOKEN%"=="" (
    echo ERROR: No ingresaste ningun token
    pause
    exit /b 1
)

echo.
echo Configurando Git...

:: Limpiar git anterior si existe
if exist ".git" (
    rmdir /s /q .git
)

:: Inicializar git nuevo
git init
git config user.email "elevate@app.com"
git config user.name "Elevate App"

:: Agregar todos los archivos
echo.
echo Agregando archivos...
git add .

:: Crear commit
echo.
echo Creando commit...
git commit -m "v3 - navegacion por paginas sin modales"

:: Configurar rama
git branch -M main

:: Agregar remote con token
git remote add origin https://%TOKEN%@github.com/estevinrosario-Techo/elevate-app.git

:: Subir forzando
echo.
echo Subiendo a GitHub...
git push -f origin main

echo.
if %errorlevel%==0 (
    echo ================================================
    echo   EXITO! Codigo subido correctamente
    echo   Ve a GitHub Actions para ver la compilacion
    echo   https://github.com/estevinrosario-Techo/elevate-app/actions
    echo ================================================
) else (
    echo ================================================
    echo   ERROR al subir. Verifica que el token sea valido
    echo   y tenga permisos 'repo' y 'workflow'
    echo ================================================
)

echo.
pause
