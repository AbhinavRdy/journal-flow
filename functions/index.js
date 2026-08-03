const { setGlobalOptions } = require("firebase-functions")
const { onRequest } = require("firebase-functions/https")
const { onDocumentCreated } = require("firebase-functions/v2/firestore")
const logger = require("firebase-functions/logger")
const { initializeApp } = require("firebase-admin/app")
const { getFirestore, FieldValue } = require("firebase-admin/firestore")

initializeApp()
const db = getFirestore()
setGlobalOptions({ maxInstances: 10 })

exports.getTaskStats = onRequest(
  { region: "us-central1" },
  async (request, response) => {
    const uid = request.query.uid
    if (!uid) {
      response.status(400).json({ error: "Missing uid query parameter" })
      return
    }

    const snapshot = await db.collection("tasks").where("uid", "==", uid).get()

    let total = 0
    let completed = 0
    let high = 0
    let medium = 0
    let low = 0

    snapshot.forEach((doc) => {
      const task = doc.data()
      total++
      if (task.done) completed++
      if (task.priority === "High") high++
      if (task.priority === "Medium") medium++
      if (task.priority === "Low") low++
    })

    response.json({
      total,
      completed,
      active: total - completed,
      byPriority: { high, medium, low },
    })
  },
)

exports.onTaskCreated = onDocumentCreated(
  { document: "tasks/{taskId}", region: "us-central1" },
  async (event) => {
    const task = event.data.data()
    const uid = task.uid

    if (!uid) {
      logger.warn("Task created without a uid, skipping counter update")
      return
    }

    const userRef = db.collection("users").doc(uid)
    await userRef.set(
      { totalTasksCreated: FieldValue.increment(1) },
      { merge: true },
    )

    logger.info(`Incremented totalTasksCreated for user ${uid}`)
  },
)

exports.helloTest = onRequest(
  { region: "us-central1" },
  (request, response) => {
    response.send("Hello!")
  },
)
