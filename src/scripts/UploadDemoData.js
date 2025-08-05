// scripts/uploadDemoData.js
import { db } from "../firebaseConfig";
import demoData from "./demo_data.json";
import { doc, setDoc } from "firebase/firestore";

export async function uploadDemoData() {
  const orgRef = doc(db, "organizations", demoData.organization.id);
  await setDoc(orgRef, demoData.organization);

  for (const athlete of demoData.athletes) {
    const ref = doc(db, "athletes", athlete.id);
    await setDoc(ref, athlete);
  }

  alert("Demo data uploaded!");
}