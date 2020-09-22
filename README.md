## todo

* [OK] Von URL Laden implementieren -> Würdes mir in der Entwicklung auch leichter machen

* [OK] Bei Start eines neuen Projektes mal eine Zufällige Root ID generieren! -> Wird bereits gemacht

* [OK] Messages sollen ÜBER den Modals erscheinen

* [Cleanup] Mal die ganzen console.logs weghauen

* [Bug] Beim laden eines Files schließt sich das Fenster nicht :-( Aber beim Laden einer URL schon. Komisch

* [OK] Boar. Es wird nicht gefragt. Ich kann einfach alle Files laden. Es errort alles. Es gibt keine Exceptions. Doch es gibt sie aber die ferden NICHT gefangen

* [Prüfen] Den CytoscapeSingleton rauswerfen aus den Messages! Den brauche ich nicht! Außer im Builder! Und evtl. in builder plugins.

* [Prüfen] Dann eingenen Traversal implementieren. kann nicht so schwer sein.

* [Prüfen] Prüfen, ob wir die normalen Visitors überhaupt noch brauchen im traversal der edges. Evtl. reichen da auch die testVisitors

* [Bug] Das löschen von vielen Nodes führt zu infinite Error? -> Ja weil der doch die ganze zeit am traversen ist. Und dann sind plötzlich Daten weg!

* [Bug] Text scaled manchmal seltsam nach cytoscape upgrade

* Den section finisher leiber in einen testFinisher testVisitor umwandeln? Dann ist das Ergebnis gleich da für den Haupttraversal ud kann die letzte ausgehende Route aktivieren?

* [Bug] Bei restart des Chats bleibenmacnhe nodes einfach in ihrer knalligen farbe, wenn diese nun nicht mehr durch die pulse animation erreicht werden...

* [OK] Einer der Bots geht nicht mehr wegen irgendeiner edge condition -> Ich glaube der mit dem Finisher

* [OK] Mal die Buttons im Add Menu schöner machen

* [OK] Die Modals überlagern den Chat nicht

* Pulse vom Overlay auf Farben umstellen. Ist sicher schneller -> mit add Class arbeiten und die Klasse dann im Style der Nodes definieren

* [Prüfen] Fragen brauchen eig. keine eigenen Message mehr oder?

* Einführen von Layern (Einstellbar an jedem Node) Über ein Fenster können die Layer dann ein / ausgeblendet werden. -> Siehe neue Compound sections

* Conclusion kann conclusion string exposen. Dieser kann in reports verarbeitet werden

* Vertex / Incomming edge methods (Reset / revoke)

* Watcher für Lifecycledata / Traversals bauen: Es ändert sich lifecycledata aber der traversal bleibt gleich -> hinweis auf stuck?

* Reset sections -> Sections callen dann die reset function von allen childs

* Sections in Base auslagern. Sections rufen immer den isCompleted() Status von Nodes ab? So können zum Beispiel alle Nodes der Section Rückmeldung über die kompletierung geben.

* [Feature] Mathe Nodes mit MAth.js -> Können Formelstring evaluieren ohne aber JS oder eval zu nutzen.

* [Feature] Time-Nodes -> zeit vom ersten auffinden messen, anzahl der ticks messen, datum ausgeben...

* [Feature] Löschen mit Entf geht noch nicht :-(

* Das finden der nächsten Edges / Nodes mal auf outgoers / incommers umstellen wie in wanderer-plugin-question index. Dann nur mit isEdge / isNode prüfen.

* Beim direkten reseten einer question über den einkommenden traverse greift die regel mit dem Löschen der 

* Crash, wenn du suggestion löschst, die gerade gefragt wird

* Nodes sollten kurz blocken. Zum Beispiel die messages. Dann kann ich mir das zeug sparen mit der komplexen timerding in der chat component. Die werden einfach reingeworfen. Die Sache ist, dass ich evtl. vor dem jumpen oder vor was auch immer evtl. noch kurz was anzeigen mag. Das finde ich logischer.
Ich könnte auch einfach sagen, dass edges blocken und die Zeit dort ist einstellbar. Aber wie resette ich das, wenn das Edges sind? Das geht ja dann nicht. Außer ich resette ganze sections. Oder wenn ich einen node resette werden auch die outgoing edges reseted :-)
Es gibt aber auch Edges, die verbinden Nodes, die einfach nur rechnen oder kombinieren. Die sollen ja nich tlahm sein. Daher macht es in meinen Augen Sinn den ZEitfaktor auf Nodes zu legen, die Messages ausgeben. Die Blocken ganz kurz, damit noch z.B. Messages sichtbar sind, bevor irgendwas passiertt. Daher: Message raushauen und dann kurz warten. Es muss auch nicht einstellbar sien die Zeit. Nur ein Timeout, wann die lifecycles gesetzt werden.

* Vermutlich reicht es aus, wenn es nur reset() methods gibt und keine custom sachen. Reset lässt sich über edge arrow abbilden: circle-triangle

* Achtung Sections! Was ich gebaut habe ist nicht so logisch! Denn es ist ein NEtzwerk! Alles unterhalb einer Section kann gefunden werden. Die können ja auch kreuz und quer verweisen. Macht das Sinn? Also dass die abgeschlossen werden können? ODer dass die resets triggern können? Aber finde ich eig. nicht unlogisch. -> Compund edges sind die lösung. Das sind nodes, die einen on finished event haben als default. In dieser Section können sich direkte Kind-Nodes befinden

* Multi Edges

* On Changed Event für Nodes. Also für die Lifecycle DAta.

* Bitte sections in base plugin packen...sind gerade in questions

* Den ganzen Teil mit den Sections-Selections aus der Datei EditVertex.vue aus dem Base Plugin dort hin teleporten. Dann ist es sauber
