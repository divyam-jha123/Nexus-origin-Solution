/**
 * NEXUS ORIGIN SOLUTION - Complete Google Apps Script Automation
 * Handles: Google Sheets Auto-Logging, Double Email Dispatch (Nexus HR + Client Confirmation Email), and Cloudinary JD File Link Storage.
 */

const TARGET_NEXUS_EMAIL = "nexusoriginsolution@gmail.com";

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 1. Initialize Headers if Sheet is Empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Submission Date",
        "Company Name",
        "Contact Person",
        "Phone",
        "Email",
        "Industry",
        "Location",
        "Position",
        "Employees Required",
        "Experience",
        "Salary",
        "Joining Date",
        "Notes",
        "Status",
        "JD File URL"
      ]);
      const headerRange = sheet.getRange(1, 1, 1, 15);
      headerRange.setBackground("#0F172A").setFontColor("#FFFFFF").setFontWeight("bold");
    }

    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const company = data.companyName || "N/A";
    const contact = data.contactPerson || data.contactName || "N/A";
    const phone = data.phone || "8102899935";
    const email = data.email || "N/A";
    const industry = data.industry || "General Industry";
    const location = (data.city ? data.city + ", " : "") + (data.state || data.location || "India");
    const position = data.jobPosition || data.manpowerCategory || "General Workforce";
    const employees = data.employeesRequired || data.workerCount || "1";
    const experience = data.experienceRequired || "0-2 Years";
    const salary = data.salaryRange || "Market Standard";
    const joining = data.joiningDate || "Immediate";
    const notes = data.notes || data.details || "None";
    const status = data.status || "Pending";
    const jdUrl = data.jdFileUrl || "Not Uploaded";

    // 2. Append Row to Google Sheet
    sheet.appendRow([
      timestamp,
      company,
      contact,
      phone,
      email,
      industry,
      location,
      position,
      employees,
      experience,
      salary,
      joining,
      notes,
      status,
      jdUrl
    ]);

    sheet.autoResizeColumns(1, 15);

    // 3. Send Notification Email to Nexus HR
    const nexusEmailSubject = `🚨 New Manpower Requirement Received: ${company} (${employees} ${position})`;
    const nexusEmailBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #0284c7;">Nexus Origin Solution - New Requirement Alert</h2>
        <p><strong>Company Name:</strong> ${company}</p>
        <p><strong>Contact Person:</strong> ${contact}</p>
        <p><strong>Phone Number:</strong> <a href="tel:${phone}">${phone}</a></p>
        <p><strong>Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Job Position:</strong> ${position}</p>
        <p><strong>Employees Required:</strong> ${employees} Person(s)</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Experience Required:</strong> ${experience}</p>
        <p><strong>Salary Range:</strong> ${salary}</p>
        <p><strong>Joining Date:</strong> ${joining}</p>
        <p><strong>Job Description / Notes:</strong> ${notes}</p>
        <p><strong>Uploaded JD Document:</strong> <a href="${jdUrl}">${jdUrl}</a></p>
      </div>
    `;

    try {
      MailApp.sendEmail({
        to: TARGET_NEXUS_EMAIL,
        subject: nexusEmailSubject,
        htmlBody: nexusEmailBody
      });
    } catch (err1) {
      Logger.log("Nexus Email Error: " + err1.toString());
    }

    // 4. Send Confirmation Email to Client
    const clientEmailSubject = "Thank You for Contacting Nexus Origin Solution";
    const clientEmailBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; border: 1px solid #0284c7; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
          <h1 style="color: #0f172a; margin: 0; font-size: 24px;">NEXUS ORIGIN SOLUTION</h1>
          <p style="color: #0284c7; margin: 5px 0 0 0; font-weight: bold;">Premier Manpower & HR Staffing Solutions</p>
        </div>

        <div style="padding: 20px 0; color: #334155; line-height: 1.6;">
          <p>Dear <strong>${contact}</strong>,</p>
          <p>Thank you for submitting your manpower requirement for <strong>${company}</strong>.</p>
          <p>Our recruitment team has successfully received your request for <strong>${employees} × ${position}</strong>.</p>
          <p>One of our HR specialists will contact you at <strong>${phone}</strong> within 24 hours to discuss candidate deployment.</p>

          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #0284c7; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #0f172a;">Request Summary:</p>
            <p style="margin: 5px 0 0 0;">Position: ${position} | Count: ${employees} | Location: ${location}</p>
          </div>

          <p>Regards,</p>
          <p style="margin: 0; font-weight: bold; color: #0f172a;">Nexus Origin Solution</p>
          <p style="margin: 0; color: #64748b; font-size: 13px;">Direct Helpline: 8102899935 | Email: nexusoriginsolution@gmail.com</p>
        </div>
      </div>
    `;

    if (email && email !== "N/A" && email.includes("@")) {
      try {
        MailApp.sendEmail({
          to: email,
          subject: clientEmailSubject,
          htmlBody: clientEmailBody
        });
      } catch (err2) {
        Logger.log("Client Email Error: " + err2.toString());
      }
    }

    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "Nexus Origin Solution Automation Active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
