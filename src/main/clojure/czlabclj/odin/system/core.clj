;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2015, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl" }

  czlabclj.odin.system.core

  (:require [czlabclj.xlib.util.core :refer [MakeMMap notnil?]]
            [czlabclj.xlib.util.files :refer [ReadOneFile]]
            [czlabclj.xlib.util.str :refer [strim nsb hgl?]]
            [czlabclj.xlib.util.wfs :refer [SimPTask]])

  (:require [clojure.tools.logging :as log]
            [clojure.java.io :as io])

  (:use [czlabclj.xlib.util.format]
        [czlabclj.odin.event.core]
        [czlabclj.odin.game.msgreq])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.wflow WorkFlow Job Activity PTask]
            [com.zotohlab.skaro.io WebSockEvent]
            [com.zotohlab.frwk.io XData]
            [com.zotohlab.frwk.server Emitter]
            [java.io File]
            [io.netty.channel Channel]
            [com.zotohlab.skaro.core Container]
            [com.zotohlab.odin.event Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Main entry point.
(defn- odinOnEvent ""

  [^WebSockEvent ws]

  (let [^XData data (.getData ws)
        req (->> {:socket (.getSocket ws)
                  :emitter (.emitter ws) }
                 (DecodeEvent (.stringify data))) ]
    (condp = (:type req)
      Events/PLAYGAME_REQ
      (DoPlayReq req)

      Events/JOINGAME_REQ
      (DoJoinReq req)

      (log/warn "unhandled event " req))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; One time init from the MainApp.
(defn OdinInit ""

  [^Container ctr]

  ;;TODO: loading in Odin config file. do something with it?
  (let [appDir (.getAppDir ctr)
        fp (io/file appDir "conf" "odin.conf")
        s (ReadOneFile fp)
        json (ReadJsonKW s) ]
    (log/info "Odin config= " s)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype Handler [] WorkFlow

  (startWith [_ ]
    (require 'czlabclj.odin.system.core)
    (SimPTask (fn [^Job j] (odinOnEvent (.event j))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

