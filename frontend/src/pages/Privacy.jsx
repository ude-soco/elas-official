import React from "react";
import { Grid, Link, Typography } from "@mui/material";
import ELASLogo from "../assets/images/ELAS-logo.png";

export default function Privacy() {
  return (
    <Grid container justifyContent="center" sx={{ py: 4, px: 2 }}>
      <Grid container sx={{ maxWidth: 1000, width: "100%" }} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" sx={{ pb: 2 }}>
            <Grid
              item
              component="img"
              src={ELASLogo}
              alt="NoteBot Logo"
              xs={12}
              sm={7}
              md={4}
              sx={{ width: "100%", pb: 2 }}
            />
          </Grid>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h5" gutterBottom>
                Datenschutzerklärung
              </Typography>
              <Typography sx={{ pb: 2 }}>
                Verantwortlich im Sinne der EU-Datenschutzgrundverordnung
                (DSGVO) und anderer nationaler Datenschutzgesetze der
                Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher
                Bestimmungen ist die:
              </Typography>
              <Typography gutterBottom>
                <b>Universität Duisburg-Essen</b> <br />
              </Typography>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <b>Campus Duisburg</b> <br />
                    Forsthausweg 2 <br />
                    47057 Duisburg <br />
                    Tel.: +49 203 379 - 0 <br />
                    Fax.: +49 203 379 - 3333 <br />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <b>Campus Essen</b> <br />
                    Universitätsstraße 2 <br />
                    45141 Essen <br />
                    Tel.: +49 201 183 - 0 <br />
                    Fax.: +49 201 183 - 3536 <br />
                  </Typography>
                </Grid>
              </Grid>

              <Typography gutterBottom sx={{ py: 1 }}>
                E-Mail-Adresse: webredaktion@uni-due.org <br />
                Webseite:{" "}
                <Link href="www.uni-due.de" target="_blank">
                  www.uni-due.de
                </Link>{" "}
                <br />
              </Typography>
              <Typography gutterBottom sx={{ py: 1 }}>
                Die Universität Duisburg-Essen wird vertreten durch ihre
                Rektorin: <br />
                <b>Prof. Dr. Barbara Albert</b> <br />
                <b>Campus Duisburg:</b> <br />
                Tel.: +49 203/37 9-2465 <br />
                <b>Campus Essen:</b> <br />
                Tel.: +49 201/18 3-2000 <br />
                Webseite:{" "}
                <Link href="www.uni-due.de/de/rektorat/" target="_blank">
                  www.uni-due.de/de/rektorat/
                </Link>{" "}
                <br />
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                <b>
                  Kontaktdaten des/der behördlichen Datenschutzbeauftragten:
                </b>{" "}
                <br />
              </Typography>

              <Typography gutterBottom sx={{ py: 1 }}>
                Universität Duisburg-Essen <br />
                Der behördliche Datenschutzbeauftragte <br />
                Dr. Kai-Uwe Loser
                <br />
                Forsthausweg 2 <br />
                47057 Duisburg <br />
                Tel.: +49 234/32-28720 <br />
                <b>Campus Essen:</b> <br />
                Tel.: +49 201/18 3-2000 <br />
                Email:{" "}
                <Link href="mailto:kai-uwe.loser@uni-due.de">
                  kai-uwe.loser@uni-due.de
                </Link>
                <br />
                Webseite:{" "}
                <Link
                  href="www.uni-due.de/verwaltung/datenschutz"
                  target="_blank"
                >
                  www.uni-due.de/verwaltung/datenschutz
                </Link>{" "}
                <br />
              </Typography>

              <Typography gutterBottom sx={{ pt: 1 }}>
                Wir erheben und verwenden personenbezogene Daten unserer
                Nutzer/innen grundsätzlich nur, soweit dies zur Bereitstellung
                von ELAS erforderlich ist. Dies geschieht zwecks der Wahrnehmung
                der uns übertragenen Aufgabe (Unterstützung von Lehre und
                Forschung) gemäß Art. 6 Abs. 1 lit. e DSGVO. Soweit wir für
                Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung
                einholen, dient Art. 6 Abs. 1 lit. a DSGVO als Rechtsgrundlage.
                <br />
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                <b>(1)</b> Bei der Nutzung von ELAS werden folgende Daten
                erhoben:
                <br />
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                <b>Zugangsdaten:</b> Benutzername, Passwort in verschlüsselter
                Form, E-Mail-Adresse <br />
                <b> Inhaltsdaten:</b> (z.B. hochgeladene Dateien, Forenbeiträge,
                Markierungen, Kommentare) <br />
                <b> Aktivitätsdaten:</b> (alle vom Benutzer durchgeführten
                Aktivitäten, z. B. Zugriff auf das System oder seine
                Komponenten, hinzugefügte oder gelöschte Anmerkungen usw. werden
                als xAPI-Statements protokolliert) <br />
                <b>Anmeldung (Zugangsdaten):</b> Für die Nutzung von ELAS ist es
                notwendig, sich unter Angabe personenbezogener Daten zu
                registrieren. Folgende Daten werden im Rahmen des
                Anmeldeprozesses erhoben: <br />
                <ul>
                  <li>Benutzername</li>
                  <li>Passwort in verschlüsselter Form</li>
                  <li>E-Mail-Adresse</li>
                </ul>
                Im Rahmen der erstmaligen Anmeldung wird über die Verarbeitung
                dieser Daten informiert. Rechtsgrundlage für die Verarbeitung
                der Daten ist Art. 6 Abs. 1 lit. e DSGVO. Die Anmeldung des
                Nutzers/der Nutzerin ist für das Bereitstellen der Inhalte und
                Funktionen von ELAS zum Zweck der Durchführung von Forschung und
                Lehre erforderlich. Eine Weitergabe der Daten an Dritte erfolgt
                nicht.
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                <b>Löschung von Daten</b> <br />
                Die Daten werden gelöscht, wenn das Nutzer/innenkonto gelöscht
                wird. Nutzer/innen können ihr Nutzer/innenkonto jederzeit
                löschen lassen. <br />
                Hierzu reicht das Schreiben einer formlosen E-Mail an die
                ELAS-Administration unter der Adresse{" "}
                <Link href="mailto:ralf.berger@uni-due.de">
                  ralf.berger@uni-due.de
                </Link>
                . <br />
                Nutzer/innen können ihre Zugangsdaten jederzeit berichtigen
                lassen. Hierzu reicht das Schreiben einer formlosen E-Mail an
                die ELAS-Administration unter der Adresse{" "}
                <Link href="mailto:ralf.berger@uni-due.de">
                  ralf.berger@uni-due.de
                </Link>
                . <br />
                Eine Mitteilung hierüber an andere Nutzer/innen erfolgt nicht.
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                <b>Inhaltsdaten</b> <br />
                Der Zugriff auf die Inhaltsdaten wird in der ELAS-Datenbank
                gespeichert, z.B. zu welcher Zeit welche Nutzer/innen auf welche
                Bestandteile der Kurse zugreifen. <br />
                Diese Daten sind nur der Administration der ELAS-Plattform
                zugänglich, nicht jedoch anderen Nutzer/innen. Sie dienen der
                technischen und nutzerfreundlichen Optimierung und werden nicht
                an andere Personen weitergegeben. Protokolliert wird ferner
                unter anderem je nach Ausgestaltung des einzelnen Kurses, zu
                welcher Zeit welche Teilnehmer/innen welche Beiträge in den
                eventuell angebotenen Learning Channels geleistet haben. <br />
                Diese Aktivitätsdaten werden als xAPI-Statements protokolliert
                und in der ELAS-Datenbank gespeichert. Diese Daten sind nur der
                Administration der ELAS-Plattform zugänglich, nicht jedoch
                anderen Nutzer/innen. Sie dienen ausschließlich der Durchführung
                des jeweiligen Kurses, der Unterstützung der Zusammenarbeit in
                dem Kurs und der Verbesserung des Lernerfolgs und werden nicht
                an andere Personen weitergegeben. <br />
                Die Daten in den ELAS-Logfiles werden gelöscht, wenn der
                jeweilige Kurs gelöscht wird. Gemäß Art. 89 DSGVO dürfen Daten
                zu wissenschaftlichen oder historischen Forschungszwecken oder
                statistischen Zwecken verarbeitet werden. Eine solche
                Verarbeitung ist nur in anonymisierter oder pseudonymisierter
                Form möglich. <br />
              </Typography>

              <Typography gutterBottom sx={{ pt: 1 }}>
                <b>(2)</b> ELAS setzt Cookies ein. Hierbei handelt es sich um
                kleine Textdateien, die auf Ihrem Computer gespeichert werden,
                wenn Sie die ELAS-Website besuchen.
                <br />
                In dem Cookie werden Informationen abgelegt, die sich jeweils im
                Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben.
                Der Einsatz von Cookies dient dazu, die Nutzung unseres Angebots
                zu ermöglichen. <br />
                Wir setzen sogenannte Session-Cookies ein, um zu erkennen, dass
                Sie einzelne Seiten von ELAS bereits besucht haben. Dieses
                Cookie muss erlaubt sein, damit der Login bei den Zugriffen von
                Seite zu Seite erhalten bleibt. Darüber hinaus werden temporäre
                Cookies zur Authentisierung angemeldeter Nutzer eingesetzt. Alle
                Cookies werden beim Abmelden oder beim Beenden des Webbrowsers
                automatisch gelöscht. <br />
                Die Rechtsgrundlage für die Verarbeitung personenbezogener Daten
                unter Verwendung von Cookies ist Art. 6 Abs. 1 lit. e DSGVO.{" "}
                <br />
                Die durch die Cookies erzeugten Informationen über Ihre
                Benutzung dieser Webseite werden nicht an Dritte weitergegeben.
                Cookies werden auf dem Rechner des Nutzers/der Nutzerin
                gespeichert und von diesem an unserer Seite übermittelt. <br />{" "}
                Daher haben Nutzer/innen auch die volle Kontrolle über die
                Verwendung von Cookies. Werden Cookies für ELAS deaktiviert,
                können nicht mehr alle Funktionen von ELAS vollumfänglich
                genutzt werden.
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                <b>(3)</b> erden personenbezogene Daten von Ihnen verarbeitet,
                sind Sie Betroffene/r i.S.d. DSGVO und es stehen Ihnen folgende
                Rechte gegenüber dem Verantwortlichen zu:
                <br />
                Sie können von uns Auskunft zu den personenbezogenen Daten, die
                Sie betreffen und die von ELAS verarbeitet werden, verlangen.
                Gemäß Art. 15 DSGVO können Sie eine Kopie dieser Daten
                verlangen. <br />
                Sie haben außerdem das Recht auf Berichtigung (gemäß Art. 16
                DSGVO) oder Löschung der Sie betreffenden personenbezogenen
                Daten (gemäß Art. 17 DSGVO), das Recht auf Einschränkung der
                Verarbeitung durch den Verantwortlichen (gemäß Art. 18 DSGVO)
                oder ein Widerspruchsrecht gegen diese Verarbeitung (gemäß Art.
                21 DSGVO) und ein Recht auf Datenübertragbarkeit (gemäß Art. 20
                DSGVO). <br />
                Sie haben das Recht, nicht einer ausschließlich auf einer
                automatisierten Verarbeitung beruhenden Entscheidung unterworfen
                zu werden, die Ihnen gegenüber rechtliche Wirkung entfaltet oder
                sie in ähnlicher Weise erheblich beeinträchtigt (gemäß Art. 22
                DSGVO).
                <br />
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                Es besteht das Recht zur Beschwerde bei der für die Universität
                Duisburg-Essen zuständigen Aufsichtsbehörde:
                <br />
              </Typography>
              <Typography gutterBottom sx={{ pt: 1 }}>
                Die Landesbeauftragte für Datenschutz und Informationsfreiheit
                Nordrhein-Westfalen
                <br />
                Kavalleriestr. 2-4
                <br />
                40213 Düsseldorf
                <br />
                Webseite:{" "}
                <Link href="https://www.ldi.nrw.de/" target="_blank">
                  https://www.ldi.nrw.de/
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
