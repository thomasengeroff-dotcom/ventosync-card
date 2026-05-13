---
description: Automatisiert den Release-Prozess inkl. Commit, Tagging und Push für die VentoSync Card.
---

# Workflow: Release VentoSync Card

Wenn dieser Workflow aufgerufen wird, führst du als KI-Assistent vollautomatisch den Git-Release-Prozess für das Projekt durch.

## Ablauf:

1. **Linting (Sicherheitscheck):**
   Führe im Terminal den Befehl `npm run lint` aus. 
   **WICHTIG:** Falls ESLint Fehler meldet (Exit Code != 0), brich den Workflow sofort ab und zeige dem User die Fehler. Mache erst mit den nächsten Schritten weiter, wenn das Linting erfolgreich war!

2. **Änderungen analysieren & Commit Message generieren:**
   Führe im Terminal `git status` und `git diff` aus, um die uncommitteten Änderungen zu analysieren.
   Generiere daraus eine prägnante, kurze Commit-Message im Format Conventional Commits (z.B. `feat: ...` oder `fix: ...` oder `style: ...`).

2. **Aktuelle Git-Version prüfen:**
   Führe im Terminal den Befehl `git tag --list 'v*' --sort=-v:refname | head -n 1` aus, um den aktuellsten Git-Tag (z.B. `v1.1.4`) zu ermitteln.
   Ermittle daraus die `<nächste freie version>` (z.B. Patch-Bump auf `v1.1.5`).

3. **Git Befehle ausführen:**
   Führe im Terminal die folgenden Befehle aus, um die Änderungen zu committen, zu taggen und auf GitHub hochzuladen:
   
   // turbo
   `git add . && git commit -m "DEINE_COMMIT_MESSAGE" && git tag DEINE_NEUE_VERSION && git push && git push --tags`
   
   *(Setze beim Ausführen `SafeToAutoRun` auf `true`, um den Prozess zu beschleunigen).*

4. **Abschlussmeldung:**
   Zeige dem User nach erfolgreichem Durchlauf kurz die verwendete Commit-Message sowie den neuen Tag an und weise darauf hin, dass die GitHub Action nun durch den neuen Tag automatisch gestartet wurde.
