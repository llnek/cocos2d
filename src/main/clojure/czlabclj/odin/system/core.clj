;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl" }

  czlabclj.odin.system.core

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap notnil?]]
        [czlabclj.xlib.util.files :only [ReadOneFile]]
        [czlabclj.xlib.util.format]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.xlib.util.wfs :only [SimPTask]]
        [czlabclj.odin.event.core]
        [czlabclj.odin.game.msgreq])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.wflow Job Activity
                                Pipeline PDelegate PTask]
            [com.zotohlab.skaro.io WebSockEvent Emitter]
            [com.zotohlab.frwk.io IOUtils XData]
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
        fp (File. appDir "conf/odin.conf")
        s (ReadOneFile fp)
        json (ReadJsonKW s) ]
    (log/info "Odin config= " s)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype Handler [] PDelegate

  (onError [ _ err curPt] (log/error "Handler: I got an error!"))
  (onStop [_ pipe] )
  (startWith [_  pipe] (SimPTask (fn [^Job j] (odinOnEvent (.event j))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

