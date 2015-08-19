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

  czlab.odin.game.player

  (:require
    [czlab.xlib.util.core :refer [MubleObj! ]]
    [czlab.xlib.util.logging :as log]
    [czlab.xlib.util.str :refer [strim hgl?]])

  (:import
    [com.zotohlab.odin.game Game PlayRoom
    Player PlayerSession]
    [com.zotohlab.skaro.core Muble]
    [com.zotohlab.odin.core Session]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; players
;; { player-id -> player }
(def ^:private PLAYER-REGO (ref {}))

;; { player-id -> map of sessions { id -> session } }
(def ^:private PLAYER-SESS (ref {}))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyPlayer ""

  ^Player
  [^String user ^String pwd]

  (let [impl (MubleObj!) ]
    (reify

      Player

      (setEmailId [_ email] (.setv impl :email email))
      (emailId [_] (.getv impl :email))

      (setName [_ n] (.setv impl :name n))
      (getName [_] (.getv impl :name))
      (id [_] user)

      (removeSession [_ ps]
        (dosync
          (when-some [m (@PLAYER-SESS user) ]
            (alter PLAYER-SESS
                   assoc
                   user
                   (dissoc m (.id ^Session ps))))))

      (countSessions [_]
        (dosync
          (if-some [m (@PLAYER-SESS user)]
            (int (count m))
            (int 0))))

      (addSession [_ ps]
        (dosync
          (let [m (or (@PLAYER-SESS user) {}) ]
            (alter PLAYER-SESS
                   assoc
                   user
                   (assoc m (.id ^Session ps) ps)))))

      (logout [_ ps]
        (dosync
          (when-some [m (@PLAYER-SESS user)]
            (doseq [^PlayerSession
                    pss (vals m)]
              (.close pss))
            (alter PLAYER-SESS dissoc user)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn RemovePlayer ""

  ^Player
  [^String user]

  (dosync
    (when-some [p (@PLAYER-REGO user) ]
      (alter PLAYER-REGO dissoc user)
      (when-some [m (@PLAYER-SESS user)]
        (doseq [^Session v (vals m)]
          (.close v)))
      (alter PLAYER-SESS dissoc user)
      p)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn CreatePlayer ""

  ^Player
  [^String user ^String pwd]

  (dosync
    (if-some [p (@PLAYER-REGO user)]
      p
      (let [p2 (ReifyPlayer user pwd)]
        (alter PLAYER-REGO assoc user p2)
        (alter PLAYER-SESS assoc user {})
        p2))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn LookupPlayer ""

  (^Player
    [^String user ^String pwd]
    (CreatePlayer user pwd))

  (^Player
    [^String user]
    (dosync (get @PLAYER-REGO user))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;EOF

