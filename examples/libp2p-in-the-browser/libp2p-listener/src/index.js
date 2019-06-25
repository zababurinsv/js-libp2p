/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint max-nested-callbacks: ["error", 5] */
'use strict'

const domReady = require('detect-dom-ready')
const createNode = require('./create-node')

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

let time

domReady(() => {
  const myPeerDiv = document.getElementById('my-peer')
  const swarmDiv = document.getElementById('swarm')

  createNode((err, node) => {
    if (err) {
      return console.log('Could not create the Node, check if your browser has WebRTC Support', err)
    }

    node.on('peer:discovery', (peerInfo) => {
      // console.log('Discovered a peer:', peerInfo.id.toB58String())
    })

    node.on('peer:connect', (peerInfo) => {
      const idStr = peerInfo.id.toB58String()

      if (commonPeers.indexOf(idStr) === -1) {
        console.log('Got connection to: ' + idStr)

        const connDiv = document.createElement('div')
        connDiv.innerHTML = 'Connected to: ' + idStr
        connDiv.id = idStr
        swarmDiv.append(connDiv)
      }
    })

    node.on('peer:disconnect', (peerInfo) => {
      const idStr = peerInfo.id.toB58String()
      const el = document.getElementById(idStr)
      el && el.remove()
    })

    node.start((err) => {
      if (err) {
        return console.log(err)
      }

      const idStr = node.peerInfo.id.toB58String()

      const idDiv = document
        .createTextNode('Node is ready. ID: ' + idStr)

      myPeerDiv.append(idDiv)

      console.log('Node is listening o/')

      // NOTE: to stop the node
      // node.stop((err) => {})
    })
  })
})
