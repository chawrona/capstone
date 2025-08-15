# Instalacja projektu

```bash
git clone https://github.com/chawrona/capstone.git
cd capstone
npm install
cp .env.example .env
npm run test
npm run dev
````

# Nowe zmiany (workflow developerski)

```bash
npm run fix
git add .
git commit -m "<commit-message>"
git push origin <branch-name>
```

# Rozwiązywanie konfliktów

```bash
git fetch main
git merge main
```

1. Napraw konflikty w kodzie (terminal pokaże pliki z konfliktami — wystarczy otworzyć je po kolei). 
Komendą `git status` sprawdzisz, które pliki wymagają interwencji.

2. Po naprawie kontynuuj jak w sekcji **Nowe zmiany**.