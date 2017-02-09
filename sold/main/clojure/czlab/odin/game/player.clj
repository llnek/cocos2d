;; Licensed under the Apache License, Version 2.0 (the "License");
;; you may not use this file except in compliance with the License.
;; You may obtain a copy of the License at
;;
;;     http://www.apache.org/licenses/LICENSE-2.0
;;
;; Unless required by applicable law or agreed to in writing, software
;; distributed under the License is distributed on an "AS IS" BASIS,
;; WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
;; See the License for the specific language governing permissions and
;; limitations under the License.
;;
;; Copyright (c) 2013-2016, Kenneth Leung. All rights reserved.


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

