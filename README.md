

## todo

* [Cleanup] Mal die ganzen console.logs weghauen

* [Bug] Beim laden eines Files schließt sich das Fenster nicht :-( Aber beim Laden einer URL schon. Komisch

* [Prüfen] Den CytoscapeSingleton rauswerfen aus den Messages! Den brauche ich nicht! Außer im Builder! Und evtl. in builder plugins.

* [Prüfen] Dann eingenen Traversal implementieren. kann nicht so schwer sein.

* [Prüfen] Prüfen, ob wir die normalen Visitors überhaupt noch brauchen im traversal der edges. Evtl. reichen da auch die testVisitors

* [Bug] Text scaled manchmal seltsam nach cytoscape upgrade

* Den section finisher leiber in einen testFinisher testVisitor umwandeln? Dann ist das Ergebnis gleich da für den Haupttraversal ud kann die letzte ausgehende Route aktivieren?

* [Bug] Bei restart des Chats bleibenmacnhe nodes einfach in ihrer knalligen farbe, wenn diese nun nicht mehr durch die pulse animation erreicht werden...

* Pulse vom Overlay auf Farben umstellen. Ist sicher schneller -> mit add Class arbeiten und die Klasse dann im Style der Nodes definieren

* [Prüfen] Fragen brauchen eig. keine eigenen Message mehr oder?

* [Feature] Einführen von Layern (Einstellbar an jedem Node) Über ein Fenster können die Layer dann ein / ausgeblendet werden. -> Siehe neue Compound sections. Die blenden wiur ein / aus

* [Feature] Conclusion kann conclusion string exposen. Dieser kann in reports verarbeitet werden

* [OK] Vertex / Incomming edge methods (Reset / revoke)

* [Prüfen] Watcher für Lifecycledata / Traversals bauen: Es ändert sich lifecycledata aber der traversal bleibt gleich -> hinweis auf stuck?

* Reset sections -> Sections callen dann die reset function von allen childs

* Sections in Base auslagern. Sections rufen immer den isCompleted() Status von Nodes ab? So können zum Beispiel alle Nodes der Section Rückmeldung über die kompletierung geben.

* [Feature] Mathe Nodes mit MAth.js -> Können Formelstring evaluieren ohne aber JS oder eval zu nutzen.

* [Feature] Time-Nodes -> zeit vom ersten auffinden messen, anzahl der ticks messen, datum ausgeben...

* [Feature] Löschen mit Entf geht noch nicht :-(

* [Future] Das finden der nächsten Edges / Nodes mal auf outgoers / incommers umstellen wie in wanderer-plugin-question index. Dann nur mit isEdge / isNode prüfen.

* Multi Edges anzeigen

* On Changed Event für Nodes. Also für die Lifecycle data.

* [Prüfen] Bitte sections in base plugin packen...sind gerade in questions. Ne passt nun glaube ich so erstmal 

* childTraverse callback in traverse() implementieren

* parents beim Laden von Jsons auch setzen, damit das auch geht, wenn der Builder nicht da ist. Weil gerade ist es nur im toCytoscape definiert

* [Bug] Der Vertex Close Button geht manchmal nicht mehr

* [Prüfen] Anstelle von methods wären in Zukunft einfach auch "setter" gut. Zum Beispiel bei API Nodes kann ich mir vorstellen, damit das Querry zu bauen oder die POST Daten.

* [Feature] Wait-Node + remaining time variable

* [Feature] Api: EdgeMethods: setPostVar(), setQueryVar(). Edge name = key, Edge value = value

* [Feature] Once-Node: Der kann auch reseted werden. Der ist wichtig für zum Beispiel resets, die nur einmal durchgeführt werden sollen Evtl. als Count Node implementieren

* [Bug] Beim verschieben des Compound nodes werden nicht automatisch die Positions-Daten der Child nodes aktualisert im Store (drag drop)

* [Bug] Beim Löschen eines compounds werden alle childs gelöscht. Besser vorher alle disconnecten und das aus der vertexData werfen

* [] Reset Message Problem: Zeigt eine Reset edge auf eine Message, wird diese die ganze Zeit reingethrowed
