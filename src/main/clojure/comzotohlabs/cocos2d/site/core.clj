;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013 Cherimoia, LLC. All rights reserved.


(ns  ^{ :doc ""
        :author "kenl" }

  comzotohlabs.cocos2d.site.core

  (:require [clojure.tools.logging :as log :only (info warn error debug)])
  (:require [clojure.string :as cstr])
  (:use [comzotohlabscljc.tardis.core.constants])
  (:use [comzotohlabscljc.tardis.core.wfs])

  (:import ( com.zotohlabs.wflow FlowPoint Activity
                                 Pipeline PipelineDelegate PTask Work))
  (:import (com.zotohlabs.gallifrey.io HTTPEvent HTTPResult))
  (:import (com.zotohlabs.wflow.core Job))
  (:import (java.util HashMap Map)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(deftype MyAppMain [] comzotohlabscljc.tardis.impl.ext.CljAppMain

  (contextualize [_ container]
    (log/info "My AppMain contextualized by container " container))
  (configure [_ options]
    (log/info "My AppMain configured with options " options))
  (initialize [_]
    (log/info "My AppMain initialized!"))
  (start [_]
    (log/info "My AppMain started"))
  (stop [_]
    (log/info "My AppMain stopped"))
  (dispose [_]
    (log/info "My AppMain finz'ed")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doShowLandingPage "" 
  
  ^PTask 
  []

  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt)
             ^com.zotohlabs.gallifrey.io.Emitter src (.emitter evt)
             ^comzotohlabscljc.tardis.impl.ext.ContainerAPI co (.container src)
             ^String tpl (:template (.getv job EV_OPTS))
             [rdata ct] (.loadTemplate co tpl (HashMap.)) ]
        (.setStatus res 200)
        (.setContent res rdata)
        (.setHeader res "content-type" ct)
        (.replyResult evt)))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype LandingHandler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'comzotohlabs.cocos2d.site.core)
    (doShowLandingPage))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

