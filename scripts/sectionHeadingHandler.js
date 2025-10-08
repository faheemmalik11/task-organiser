const sectionHeadings = document.querySelectorAll('[contenteditable="true"]');

sectionHeadings.forEach((heading) => {
    heading.addEventListener("input", (e) => {  //track input for change  
        const sectionId = e.target.id;
        const updatedHeading = e.target.innerText.trim();
        localStorage.setItem(sectionId, updatedHeading);
    });
});

export const loadSavedHeadings = () => {

    sectionHeadings.forEach((heading) => {
        const sectionId = heading.id;
        const savedHeading = localStorage.getItem(sectionId);
        if (savedHeading) {
            heading.innerText = savedHeading;
        }
    })
};
