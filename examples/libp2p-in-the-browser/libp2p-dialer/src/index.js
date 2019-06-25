/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint max-nested-callbacks: ["error", 5] */
'use strict'

const domReady = require('detect-dom-ready')
const createNode = require('./create-node')

const PeerInfo = require('peer-info')
const PeerId = require('peer-id')

const peerIdDialer = {
  id: "Qma3GsJmB47xYuyahPZPSadh1avvxfyYQwk8R3UnFrQ6aP",
  privKey: "CAASpwkwggSjAgEAAoIBAQCaNSDOjPz6T8HZsf7LDpxiQRiN2OjeyIHUS05p8QWOr3EFUCFsC31R4moihE5HN+FxNalUyyFZU//yjf1pdnlMJqrVByJSMa+y2y4x2FucpoCAO97Tx+iWzwlZ2UXEUXM1Y81mhPbeWXy+wP2xElTgIER0Tsn/thoA0SD2u9wJuVvM7dB7cBcHYmqV6JH+KWCedRTum6O1BssqP/4Lbm2+rkrbZ4+oVRoU2DRLoFhKqwqLtylrbuj4XOI3XykMXV5+uQXz1JzubNOB9lsc6K+eRC+w8hhhDuFMgzkZ4qomCnx3uhO67KaICd8yqqBa6PJ/+fBM5Xk4hjyR40bwcf41AgMBAAECggEAZnrCJ6IYiLyyRdr9SbKXCNDb4YByGYPEi/HT1aHgIJfFE1PSMjxcdytxfyjP4JJpVtPjiT9JFVU2ddoYu5qJN6tGwjVwgJEWg1UXmPaAw1T/drjS94kVsAs82qICtFmwp52Apg3dBZ0Qwq/8qE1XbG7lLyohIbfCBiL0tiPYMfkcsN9gnFT/kFCX0LVs2pa9fHCRMY9rqCc4/rWJa1w8sMuQ23y4lDaxKF9OZVvOHFQkbBDrkquWHE4r55fchCz/rJklkPJUNENuncBRu0/2X+p4IKFD1DnttXNwb8j4LPiSlLro1T0hiUr5gO2QmdYwXFF63Q3mjQy0+5I4eNbjjQKBgQDZvZy3gUKS/nQNkYfq9za80uLbIj/cWbO+ZZjXCsj0fNIcQFJcKMBoA7DjJvu2S/lf86/41YHkPdmrLAEQAkJ+5BBNOycjYK9minTEjIMMmZDTXXugZ62wnU6F46uLkgEChTqEP57Y6xwwV+JaEDFEsW5N1eE9lEVX9nGIr4phMwKBgQC1TazLuEt1WBx/iUT83ita7obXqoKNzwsS/MWfY2innzYZKDOqeSYZzLtt9uTtp4X4uLyPbYs0qFYhXLsUYMoGHNN8+NdjoyxCjQRJRBkMtaNR0lc5lVDWl3bTuJovjFCgAr9uqJrmI5OHcCIk/cDpdWb3nWaMihVlePmiTcTy9wKBgQCU0u7c1jKkudqks4XM6a+2HAYGdUBk4cLjLhnrUWnNAcuyl5wzdX8dGPi8KZb+IKuQE8WBNJ2VXVj7kBYh1QmSJVunDflQSvNYCOaKuOeRoxzD+y9Wkca74qkbBmPn/6FFEb7PSZTO+tPHjyodGNgz9XpJJRjQuBk1aDJtlF3m1QKBgE5SAr5ym65SZOU3UGUIOKRsfDW4Q/OsqDUImvpywCgBICaX9lHDShFFHwau7FA52ScL7vDquoMB4UtCOtLfyQYA9995w9oYCCurrVlVIJkb8jSLcADBHw3EmqF1kq3NqJqm9TmBfoDCh52vdCCUufxgKh33kfBOSlXuf7B8dgMbAoGAZ3r0/mBQX6S+s5+xCETMTSNv7TQzxgtURIpVs+ZVr2cMhWhiv+n0Omab9X9Z50se8cWl5lkvx8vn3D/XHHIPrMF6qk7RAXtvReb+PeitNvm0odqjFv0J2qki6fDs0HKwq4kojAXI1Md8Th0eobNjsy21fEEJT7uKMJdovI/SErI=",
  pubKey: "CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCaNSDOjPz6T8HZsf7LDpxiQRiN2OjeyIHUS05p8QWOr3EFUCFsC31R4moihE5HN+FxNalUyyFZU//yjf1pdnlMJqrVByJSMa+y2y4x2FucpoCAO97Tx+iWzwlZ2UXEUXM1Y81mhPbeWXy+wP2xElTgIER0Tsn/thoA0SD2u9wJuVvM7dB7cBcHYmqV6JH+KWCedRTum6O1BssqP/4Lbm2+rkrbZ4+oVRoU2DRLoFhKqwqLtylrbuj4XOI3XykMXV5+uQXz1JzubNOB9lsc6K+eRC+w8hhhDuFMgzkZ4qomCnx3uhO67KaICd8yqqBa6PJ/+fBM5Xk4hjyR40bwcf41AgMBAAE="
}

const commonPeers = [
  'QmPeEGJUikzoZcrUDRLms7RePt6zG7HBWDDQZSNXZKAhHt',
  'QmUxxcryRTJaM8H7Cqh2qAL4YqprTQYrxhg3Jkbf7Lfius',
  'QmRtryPuULa74dG2Navgw6c26U1jLyXMEU6JQegiXWKCSz',
  'QmUfLzeaJdDNXKsdHrYKE37gkxySfgLiCC1HPhsKNTWH5L',
  'QmQSdqeBA8UvqBXTC5JLkBrBgPgg9xkAtoFyFZSEHJtDfC',
  'Qmdp2yQDyJVqzLN2AH1V6p6X5hXQSHK68u7Gs9UrFbXCED',
  'QmU6Ta9CC7naQQyQwXRp4s4xKWhtufNq46fK9RWBREAuvS',
  'QmVddtFXfhf4BHYU6DLCBg4J5BXG4V262V3VxNTn3VKsHE',
  'QmVuEoK4MjCGkMJYsCg2a7wn6BLGekPF47jsszkEHaaD13',
  'QmWpzaFNiezm4BKvXe3XxqAebpXh7irxDzJNMbmmNdyCQG',
  'QmVuEoK4MjCGkMJYsCg2a7wn6BLGekPF47jsszkEHaaD13',
]

domReady(() => {
  const myPeerDiv = document.getElementById('my-peer')
  const swarmDiv = document.getElementById('swarm')

  createNode((err, node) => {
    if (err) {
      return console.log('Could not create the Node, check if your browser has WebRTC Support', err)
    }

    node.on('peer:connect', (peerInfo) => {
      const idStr = peerInfo.id.toB58String()

      if (commonPeers.indexOf(idStr) === -1) {
        console.log('You are now connected with: ' + idStr)

        if (idStr === 'Qma3GsJmB47xYuyahPZPSadh1avvxfyYQwk8R3UnFrQ6aP') {
          const connDiv = document.createElement('div')
          connDiv.innerHTML = 'Wat! You are connected to: ' + idStr
          connDiv.id = idStr
          connDiv.setAttribute('style', 'color: green')
          swarmDiv.append(connDiv)
        } else {
          const connDiv = document.createElement('div')
          connDiv.innerHTML = 'connected to: ' + idStr
          connDiv.id = idStr
          swarmDiv.append(connDiv)
        }
      }
    })

    node.on('peer:disconnect', (peerInfo) => {
      const idStr = peerInfo.id.toB58String()

      if (idStr === 'Qma3GsJmB47xYuyahPZPSadh1avvxfyYQwk8R3UnFrQ6aP') {
        const el = document.getElementById(idStr)
        el && el.remove()
      }
    })

    node.start((err) => {
      if (err) {
        return console.log(err)
      }

      const idStr = node.peerInfo.id.toB58String()

      const idDiv = document
        .createTextNode('Node is ready. ID: ' + idStr + '\n\n\n')

      myPeerDiv.append(idDiv)

      console.log('Node is listening o/')

      setTimeout(() => {
        PeerId.createFromJSON(peerIdDialer, (err, peerId) => {
          const peerInfo = new PeerInfo(peerId)
          const ma = `/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/p2p/${peerId.toB58String()}`

          peerInfo.multiaddrs.add(ma)

          node.dial(peerInfo, (err) => {
            console.log('dialed listener', err)
          })
        })
      }, 4000)

      // NOTE: to stop the node
      // node.stop((err) => {})
    })
  })
})
