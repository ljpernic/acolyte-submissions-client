// Capitalize helper for dynamic state setters
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const displayComponentHelper = ({
  component,
  values,
  setStateFunctions, // State setters passed from the main dashboard
}) => {
  // Configuration object
  const componentConfig = {
    firstRender: {
      newStatus: null,
      displayName: "Initial Render",
      fields: {
        title: false,
        name: false,
        thankYou: false,
        magazine: false,
        unfortunately: false,
        invite: false,
        subjective: false,
        readerNote: false,
        coverLetter: true,
        recommend: false,
        readerName: false,
        havenSpecTeam: false,
      },
    },
    testHigh: {
      newStatus: "Rejected, Third Round",
      displayName: "Top-Tier Rejection",
      fields: {
        title: true,
        name: true,
        thankYou: true,
        magazine: true,
        unfortunately: true,
        invite: true,
        subjective: true,
        readerNote: true,
        coverLetter: false,
        recommend: false,
        readerName: true,
        havenSpecTeam: false,
      },
    },
    testMiddle: {
        newStatus: "Rejected, Second Round",
        displayName: "Middle-Tier Rejection",
        fields: {
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: true,
          invite: true,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: false,
          readerName: true,
          havenSpecTeam: false,
        },
      },
      testLow: {
        newStatus: "Rejected, First Round",
        displayName: "Low-Tier Rejection",
        fields: {
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: true,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: false,
          readerName: true,
          havenSpecTeam: false,
        },
      },
      testAnon: {
        newStatus: "Rejected Anonymously",
        displayName: "Anonymous Rejection",
        fields: {
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: true,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: false,
          readerName: false,
          havenSpecTeam: true,
        },
      },
      testRec: {
        newStatus: "Recommended",
        displayName: "Recommend",
        fields: {
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: false,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: true,
          readerName: true,
          havenSpecTeam: false,
        },
      },
    testUpdate: {
      newStatus: values.status,
      displayName: "Update",
      fields: {
        title: false,
        name: false,
        thankYou: false,
        magazine: false,
        unfortunately: false,
        invite: false,
        subjective: false,
        readerNote: false,
        coverLetter: true,
        recommend: false,
        readerName: false,
        havenSpecTeam: false,
      },
    },
    testCover: {
        newStatus: values.status,
        displayName: "Cover Letter",
        fields: {
          title: false,
          name: false,
          thankYou: false,
          magazine: false,
          unfortunately: false,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: true,
          recommend: false,
          readerName: false,
        },
      },
      testOpen: {
        newStatus: values.status,
        displayName: "Open File",
        fields: {
          title: false,
          name: false,
          thankYou: false,
          magazine: false,
          unfortunately: false,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: true,
          recommend: false,
          readerName: false,
          havenSpecTeam: false,
        },
      },
  };

  // Check if the component exists in the configuration
  if (componentConfig[component]) {
    const { newStatus, displayName, fields } = componentConfig[component];

    // Update core states
    setStateFunctions.setComponentToShow(component);
    setStateFunctions.setNewStatus(newStatus);
    setStateFunctions.setTestShowDisplayName(displayName);

    // Update dynamic field visibility states
    for (const field in fields) {
      const stateSetter = setStateFunctions[`setTestShow${capitalize(field)}`];
      if (stateSetter) {
        stateSetter(fields[field]);
      }
    }

    // Optionally show the button
    const button = document.getElementById("verarbeitenButton");
    if (button) {
      button.style.display = "block";
    }
  } else {
    console.warn(`Component "${component}" not found in configuration.`);
  }
};
