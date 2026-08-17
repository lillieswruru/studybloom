// ========================================
// DATE
// ========================================

const todayElement =
    document.getElementById("today");

const today = new Date();

todayElement.textContent =
    today.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );



// ========================================
// NAVIGATION
// ========================================

const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );

const pages =
    document.querySelectorAll(
        ".page"
    );


navButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const pageName =
                    button.dataset.page;


                navButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                pages.forEach(
                    function (page) {

                        page.classList.remove(
                            "active-page"
                        );

                    }
                );


                document
                    .getElementById(
                        pageName + "Page"
                    )
                    .classList.add(
                        "active-page"
                    );


                if (
                    pageName ===
                    "calendar"
                ) {

                    renderCalendar();

                }

            }
        );

    }
);



// ========================================
// ASSIGNMENTS
// ========================================

let assignments =
    JSON.parse(
        localStorage.getItem(
            "assignments"
        )
    ) || [];



const assignmentForm =
    document.getElementById(
        "assignmentForm"
    );


document
    .getElementById(
        "addAssignmentButton"
    )
    .addEventListener(
        "click",
        function () {

            assignmentForm
                .classList
                .remove("hidden");

        }
    );


document
    .getElementById(
        "cancelAssignment"
    )
    .addEventListener(
        "click",
        function () {

            assignmentForm
                .classList
                .add("hidden");

            clearAssignmentForm();

        }
    );


document
    .getElementById(
        "saveAssignment"
    )
    .addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById(
                        "assignmentName"
                    )
                    .value
                    .trim();


            const course =
                document
                    .getElementById(
                        "assignmentCourse"
                    )
                    .value
                    .trim();


            const date =
                document
                    .getElementById(
                        "assignmentDate"
                    )
                    .value;


            const priority =
                document
                    .getElementById(
                        "assignmentPriority"
                    )
                    .value;


            if (
                name === "" ||
                date === ""
            ) {

                alert(
                    "Please enter an assignment name and due date."
                );

                return;

            }


            assignments.push({

                id: Date.now(),

                name: name,

                course: course,

                date: date,

                priority: priority,

                completed: false

            });


            saveAssignments();

            displayAssignments();

            assignmentForm
                .classList
                .add("hidden");

            clearAssignmentForm();

            renderCalendar();

        }
    );



function saveAssignments() {

    localStorage.setItem(
        "assignments",
        JSON.stringify(
            assignments
        )
    );

}



function displayAssignments() {

    const list =
        document.getElementById(
            "assignmentList"
        );


    const dashboardList =
        document.getElementById(
            "dashboardAssignmentList"
        );


    list.innerHTML = "";

    dashboardList.innerHTML = "";


    assignments.sort(
        function (a, b) {

            return (
                new Date(a.date)
                -
                new Date(b.date)
            );

        }
    );


    assignments.forEach(
        function (assignment) {

            const element =
                createAssignmentElement(
                    assignment
                );


            list.appendChild(
                element
            );

        }
    );


    // Dashboard only shows first 5

    assignments
        .slice(0, 5)
        .forEach(
            function (assignment) {

                dashboardList.appendChild(
                    createAssignmentElement(
                        assignment
                    )
                );

            }
        );


    updateAssignmentCount();

}



function createAssignmentElement(
    assignment
) {

    const element =
        document.createElement(
            "div"
        );


    element.classList.add(
        "assignment"
    );


    if (
        assignment.completed
    ) {

        element.classList.add(
            "completed"
        );

    }


    let priorityText;


    if (
        assignment.priority ===
        "urgent"
    ) {

        priorityText =
            "🔴 High";

    }

    else if (
        assignment.priority ===
        "medium"
    ) {

        priorityText =
            "🟡 Medium";

    }

    else {

        priorityText =
            "🟢 Low";

    }


    element.innerHTML = `

        <div class="assignment-info">

            <strong>
                ${assignment.name}
            </strong>

            <p>
                ${assignment.course || "University"}
                · Due ${assignment.date}
            </p>

        </div>


        <div class="assignment-actions">

            <span>
                ${priorityText}
            </span>

            <button
                class="complete-button">
                ✓
            </button>

            <button
                class="delete-button">
                🗑
            </button>

        </div>

    `;


    element
        .querySelector(
            ".complete-button"
        )
        .addEventListener(
            "click",
            function () {

                assignment.completed =
                    !assignment.completed;

                saveAssignments();

                displayAssignments();

                renderCalendar();

                updateProgress();

            }
        );


    element
        .querySelector(
            ".delete-button"
        )
        .addEventListener(
            "click",
            function () {

                assignments =
                    assignments.filter(
                        function (item) {

                            return (
                                item.id
                                !==
                                assignment.id
                            );

                        }
                    );


                saveAssignments();

                displayAssignments();

                renderCalendar();

            }
        );


    return element;

}



function updateAssignmentCount() {

    const remaining =
        assignments.filter(
            function (assignment) {

                return (
                    !assignment.completed
                );

            }
        ).length;


    document
        .getElementById(
            "assignmentCount"
        )
        .textContent =
        remaining;

}



function clearAssignmentForm() {

    document
        .getElementById(
            "assignmentName"
        )
        .value = "";


    document
        .getElementById(
            "assignmentCourse"
        )
        .value = "";


    document
        .getElementById(
            "assignmentDate"
        )
        .value = "";


    document
        .getElementById(
            "assignmentPriority"
        )
        .value = "urgent";

}



// Dashboard add button

document
    .getElementById(
        "dashboardAddAssignment"
    )
    .addEventListener(
        "click",
        function () {

            document
                .querySelector(
                    '[data-page="assignments"]'
                )
                .click();

            assignmentForm
                .classList
                .remove("hidden");

        }
    );



// ========================================
// HABITS
// ========================================

let habits =
    JSON.parse(
        localStorage.getItem(
            "habits"
        )
    ) || [

        {
            id: 1,
            name: "Drink water",
            completed: false
        },

        {
            id: 2,
            name: "Study for 1 hour",
            completed: false
        },

        {
            id: 3,
            name: "Exercise",
            completed: false
        },

        {
            id: 4,
            name: "Read 20 pages",
            completed: false
        },

        {
            id: 5,
            name: "Sleep before midnight",
            completed: false
        }

    ];



const habitForm =
    document.getElementById(
        "habitForm"
    );


document
    .getElementById(
        "addHabitButton"
    )
    .addEventListener(
        "click",
        function () {

            habitForm
                .classList
                .remove("hidden");

        }
    );


document
    .getElementById(
        "cancelHabit"
    )
    .addEventListener(
        "click",
        function () {

            habitForm
                .classList
                .add("hidden");

        }
    );


document
    .getElementById(
        "saveHabit"
    )
    .addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById(
                        "habitName"
                    )
                    .value
                    .trim();


            if (
                name === ""
            ) {

                alert(
                    "Please enter a habit."
                );

                return;

            }


            habits.push({

                id: Date.now(),

                name: name,

                completed: false

            });


            saveHabits();

            displayHabits();

            habitForm
                .classList
                .add("hidden");

            document
                .getElementById(
                    "habitName"
                )
                .value = "";

        }
    );



function saveHabits() {

    localStorage.setItem(
        "habits",
        JSON.stringify(
            habits
        )
    );

}



function createHabitElement(
    habit
) {

    const element =
        document.createElement(
            "div"
        );


    element.classList.add(
        "habit"
    );


    element.innerHTML = `

        <div class="habit-left">

            <input
                type="checkbox"
                class="habit-checkbox"
                ${habit.completed
                    ? "checked"
                    : ""}>

            <span>
                ${habit.name}
            </span>

        </div>


        <button
            class="habit-delete">
            🗑
        </button>

    `;


    element
        .querySelector(
            ".habit-checkbox"
        )
        .addEventListener(
            "change",
            function (event) {

                habit.completed =
                    event.target.checked;

                saveHabits();

                displayHabits();

                updateProgress();

            }
        );


    element
        .querySelector(
            ".habit-delete"
        )
        .addEventListener(
            "click",
            function () {

                habits =
                    habits.filter(
                        function (item) {

                            return (
                                item.id
                                !==
                                habit.id
                            );

                        }
                    );


                saveHabits();

                displayHabits();

                updateProgress();

            }
        );


    return element;

}



function displayHabits() {

    const list =
        document.getElementById(
            "habitList"
        );


    const dashboardList =
        document.getElementById(
            "dashboardHabitList"
        );


    list.innerHTML = "";

    dashboardList.innerHTML = "";


    habits.forEach(
        function (habit) {

            list.appendChild(
                createHabitElement(
                    habit
                )
            );

        }
    );


    habits
        .slice(0, 5)
        .forEach(
            function (habit) {

                dashboardList.appendChild(
                    createHabitElement(
                        habit
                    )
                );

            }
        );


    updateHabitProgress();

}



function updateHabitProgress() {

    const completed =
        habits.filter(
            function (habit) {

                return habit.completed;

            }
        ).length;


    document
        .getElementById(
            "habitProgress"
        )
        .textContent =
        `${completed}/${habits.length}`;

}



// Dashboard add habit

document
    .getElementById(
        "dashboardAddHabit"
    )
    .addEventListener(
        "click",
        function () {

            document
                .querySelector(
                    '[data-page="habits"]'
                )
                .click();

            habitForm
                .classList
                .remove("hidden");

        }
    );



// ========================================
// TODO LIST
// ========================================

let todos =
    JSON.parse(
        localStorage.getItem(
            "todos"
        )
    ) || [];



document
    .getElementById(
        "addTodoButton"
    )
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "todoForm"
                )
                .classList
                .remove("hidden");

        }
    );


document
    .getElementById(
        "cancelTodo"
    )
    .addEventListener(
        "click",
        function () {

            document
                .getElementById(
                    "todoForm"
                )
                .classList
                .add("hidden");

        }
    );


document
    .getElementById(
        "saveTodo"
    )
    .addEventListener(
        "click",
        function () {

            const name =
                document
                    .getElementById(
                        "todoName"
                    )
                    .value
                    .trim();


            if (
                name === ""
            ) {

                alert(
                    "Please enter a task."
                );

                return;

            }


            todos.push({

                id: Date.now(),

                name: name,

                completed: false

            });


            localStorage.setItem(
                "todos",
                JSON.stringify(
                    todos
                )
            );


            displayTodos();


            document
                .getElementById(
                    "todoName"
                )
                .value = "";


            document
                .getElementById(
                    "todoForm"
                )
                .classList
                .add("hidden");

        }
    );



function displayTodos() {

    const list =
        document.getElementById(
            "todoList"
        );


    list.innerHTML = "";


    todos.forEach(
        function (todo) {

            const element =
                document.createElement(
                    "div"
                );


            element.classList.add(
                "todo"
            );


            element.innerHTML = `

                <div class="todo-left">

                    <input
                        type="checkbox"
                        class="todo-checkbox"
                        ${todo.completed
                            ? "checked"
                            : ""}>

                    <span>
                        ${todo.name}
                    </span>

                </div>

                <button
                    class="habit-delete">
                    🗑
                </button>

            `;


            element
                .querySelector(
                    ".todo-checkbox"
                )
                .addEventListener(
                    "change",
                    function (event) {

                        todo.completed =
                            event.target.checked;

                        saveTodos();

                    }
                );


            element
                .querySelector(
                    ".habit-delete"
                )
                .addEventListener(
                    "click",
                    function () {

                        todos =
                            todos.filter(
                                function (item) {

                                    return (
                                        item.id
                                        !==
                                        todo.id
                                    );

                                }
                            );


                        saveTodos();

                        displayTodos();

                    }
                );


            list.appendChild(
                element
            );

        }
    );

}



function saveTodos() {

    localStorage.setItem(
        "todos",
        JSON.stringify(
            todos
        )
    );

}



// ========================================
// CALENDAR
// ========================================

let calendarDate =
    new Date();


const calendarTitle =
    document.getElementById(
        "calendarTitle"
    );


const calendarDays =
    document.getElementById(
        "calendarDays"
    );



document
    .getElementById(
        "previousMonth"
    )
    .addEventListener(
        "click",
        function () {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        }
    );


document
    .getElementById(
        "nextMonth"
    )
    .addEventListener(
        "click",
        function () {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        }
    );



function renderCalendar() {

    calendarDays.innerHTML = "";


    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();


    const monthName =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarTitle.textContent =
        monthName;


    // First day

    const firstDay =
        new Date(
            year,
            month,
            1
        );


    let startingDay =
        firstDay.getDay();


    // Convert Sunday = 0
    // to Monday = 0

    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();



    // Empty days

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.classList.add(
            "calendar-day",
            "empty"
        );


        calendarDays.appendChild(
            empty
        );

    }



    // Actual days

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.classList.add(
            "calendar-day"
        );


        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        const dayNumber =
            document.createElement(
                "div"
            );


        dayNumber.classList.add(
            "calendar-day-number"
        );


        dayNumber.textContent =
            day;


        cell.appendChild(
            dayNumber
        );



        // Today

        const actualToday =
            new Date();


        if (

            day ===
            actualToday.getDate()

            &&

            month ===
            actualToday.getMonth()

            &&

            year ===
            actualToday.getFullYear()

        ) {

            cell.classList.add(
                "today"
            );

        }



        // Assignments

        const dayAssignments =
            assignments.filter(
                function (assignment) {

                    return (
                        assignment.date
                        ===
                        dateString
                    );

                }
            );


        dayAssignments
            .slice(0, 2)
            .forEach(
                function (assignment) {

                    const dot =
                        document.createElement(
                            "span"
                        );


                    dot.classList.add(
                        "assignment-dot"
                    );


                    dot.textContent =
                        "📚 " +
                        assignment.name;


                    cell.appendChild(
                        dot
                    );

                }
            );



        // Click date

        cell.addEventListener(
            "click",
            function () {

                showSelectedDate(
                    dateString
                );

            }
        );


        calendarDays.appendChild(
            cell
        );

    }

}



function showSelectedDate(
    dateString
) {

    const panel =
        document.getElementById(
            "selectedDatePanel"
        );


    const title =
        document.getElementById(
            "selectedDateTitle"
        );


    const list =
        document.getElementById(
            "selectedDateAssignments"
        );


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    title.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );


    list.innerHTML = "";


    const dayAssignments =
        assignments.filter(
            function (assignment) {

                return (
                    assignment.date
                    ===
                    dateString
                );

            }
        );


    if (
        dayAssignments.length === 0
    ) {

        list.innerHTML =
            "<p>Nothing due today 🌷</p>";

    }


    else {

        dayAssignments.forEach(
            function (assignment) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.classList.add(
                    "assignment"
                );


                item.innerHTML = `

                    <div class="assignment-info">

                        <strong>
                            ${assignment.name}
                        </strong>

                        <p>
                            ${assignment.course || "University"}
                        </p>

                    </div>

                `;


                list.appendChild(
                    item
                );

            }
        );

    }


    panel.classList.remove(
        "hidden"
    );

}



// ========================================
// PROGRESS
// ========================================

function updateProgress() {

    const completed =
        habits.filter(
            function (habit) {

                return habit.completed;

            }
        ).length;


    const total =
        habits.length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed
                    /
                    total
                ) * 100
            );


    document
        .getElementById(
            "progressFill"
        )
        .style.width =
        percentage + "%";


    document
        .getElementById(
            "progressText"
        )
        .textContent =
        `${percentage}% complete`;

}



// ========================================
// PHOTOS
// ========================================

const photos = [

    "photo1.jpeg",

    "photo2.jpeg",

    "photo3.jpeg"

];


let currentPhoto = 0;


const stackImage =
    document.getElementById(
        "stackImage"
    );


const photoNumber =
    document.getElementById(
        "photoNumber"
    );


document
    .getElementById(
        "nextPhoto"
    )
    .addEventListener(
        "click",
        function () {

            currentPhoto++;

            if (
                currentPhoto >=
                photos.length
            ) {

                currentPhoto = 0;

            }


            showPhoto();

        }
    );


document
    .getElementById(
        "previousPhoto"
    )
    .addEventListener(
        "click",
        function () {

            currentPhoto--;

            if (
                currentPhoto < 0
            ) {

                currentPhoto =
                    photos.length - 1;

            }


            showPhoto();

        }
    );


function showPhoto() {

    stackImage.src =
        photos[currentPhoto];


    photoNumber.textContent =
        `${currentPhoto + 1} / ${photos.length}`;

}



// ========================================
// START
// ========================================

displayAssignments();

displayHabits();

displayTodos();

updateProgress();

showPhoto();

renderCalendar();
// =========================
// MY CLASSES
// =========================

let myClasses = JSON.parse(
    localStorage.getItem("myClasses")
) || [];

const addClassButton =
    document.getElementById("addClassButton");

const classesContainer =
    document.getElementById("classesContainer");

addClassButton.addEventListener("click", function () {

    const className = prompt(
        "Enter your class name:"
    );

    if (!className || className.trim() === "") {
        return;
    }

    const newClass = {
        id: Date.now(),
        name: className.trim(),
        chapters: []
    };

    myClasses.push(newClass);

    localStorage.setItem(
        "myClasses",
        JSON.stringify(myClasses)
    );

    displayClasses();

});


function displayClasses() {

    classesContainer.innerHTML = "";

    if (myClasses.length === 0) {

        classesContainer.innerHTML = `
            <div class="class-empty">

                <div class="class-empty-icon">
                    🌷
                </div>

                <h3>
                    No classes yet
                </h3>

                <p>
                    Add your university classes to get started.
                </p>

            </div>
        `;

        return;
    }


    myClasses.forEach(function (course) {

        const card =
            document.createElement("div");

        card.className = "class-card";
        card.dataset.id = course.id;

        card.innerHTML = `

            <div class="class-icon">
                📚
            </div>

            <h3>
                ${course.name}
            </h3>

            <p>
                ${course.chapters.length} chapters
            </p>

        `;

        classesContainer.appendChild(card);

    });

}


displayClasses();
// =========================
// CLASS → CHAPTERS
// =========================

let selectedClass = null;

classesContainer.addEventListener("click", function (event) {

    const card = event.target.closest(".class-card");

    if (!card) return;

    const classId = Number(card.dataset.id);

    selectedClass = myClasses.find(
        course => course.id === classId
    );

    if (!selectedClass) return;

    classesContainer.classList.add("hidden");

    document
        .getElementById("classDetails")
        .classList.remove("hidden");
     document
    .getElementById("flashcardView")
    .classList.add("hidden");

    document
        .getElementById("selectedClassName")
        .textContent =
        "📚 " + selectedClass.name;

    displayChapters();

});


// =========================
// DISPLAY CHAPTERS
// =========================

function displayChapters() {

    const container =
        document.getElementById("chapterContainer");

    container.innerHTML = "";

    if (selectedClass.chapters.length === 0) {

        container.innerHTML = `
            <div class="class-empty">

                <div class="class-empty-icon">
                    📖
                </div>

                <h3>
                    No chapters yet
                </h3>

                <p>
                    Add your first chapter!
                </p>

            </div>
        `;

        return;
    }

    selectedClass.chapters.forEach(
        function (chapter, index) {

            const card =
                document.createElement("div");

            card.className = "chapter-card";
            card.dataset.id = chapter.id;

            card.innerHTML = `

                <div class="chapter-number">
                    CHAPTER ${index + 1}
                </div>

                <h3>
                    ${chapter.name}
                </h3>

                <p>
                    ${chapter.description || ""}
                </p>

            `;

            container.appendChild(card);

        }
    );
}


// =========================
// ADD CHAPTER
// =========================

document
    .getElementById("addChapterButton")
    .addEventListener(
        "click",
        function () {

            const name =
                prompt("Chapter name:");

            if (
                !name ||
                name.trim() === ""
            ) {
                return;
            }

            const description =
                prompt(
                    "Short description (optional):"
                );

            selectedClass.chapters.push({

                id: Date.now(),

                name: name.trim(),

                description:
                    description
                        ? description.trim()
                        : "",

                flashcards: []

            });

            localStorage.setItem(
                "myClasses",
                JSON.stringify(myClasses)
            );

            displayChapters();

            displayClasses();

        }
    );


// =========================
// BACK TO CLASSES
// =========================

document
    .getElementById("backToClasses")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("classDetails")
                .classList
                .add("hidden");

            classesContainer
                .classList
                .remove("hidden");

            selectedClass = null;

        }
    );// =========================
// FLASHCARDS
// =========================

let selectedChapter = null;


// OPEN CHAPTER
// =========================

// =========================
// OPEN CHAPTER → FLASHCARDS
// =========================

document
    .getElementById("chapterContainer")
    .addEventListener("click", function (event) {

        const card =
            event.target.closest(".chapter-card");

        if (!card) return;

        const chapterId =
            Number(card.dataset.id);

        selectedChapter =
            selectedClass.chapters.find(
                chapter =>
                    chapter.id === chapterId
            );

        if (!selectedChapter) return;



        // Immediately show flashcards
        document
            .getElementById("flashcardView")
            .classList.remove("hidden");


        // Set title
        document
            .getElementById("selectedChapterName")
            .textContent =
            "🧠 " + selectedChapter.name;


        // Show the cards immediately
        displayFlashcards();

    });


// DISPLAY FLASHCARDS
// =========================

function displayFlashcards() {
    

    const container =
        document.getElementById("flashcardList");

    container.innerHTML = "";

    if (selectedChapter.flashcards.length === 0) {

        container.innerHTML = `
            <div class="class-empty">

                <div class="class-empty-icon">
                    🧠
                </div>

                <h3>No flashcards yet</h3>

                <p>Add your first flashcard!</p>

            </div>
        `;

        return;
    }


    selectedChapter.flashcards.forEach(
        function (card, index) {

            const flashcard =
                document.createElement("div");

            flashcard.className =
                "study-card";

            flashcard.innerHTML = `

                <div class="study-card-inner">

                    <div class="study-card-front">

                        <span>
                            CARD ${index + 1}
                        </span>

                        <h3>
                            ${card.question}
                        </h3>

                        <p>
                            Click to reveal answer
                        </p>

                    </div>


                    <div class="study-card-back">

                        <span>
                            ANSWER
                        </span>

                        <p>
                            ${card.answer}
                        </p>

                        <small>
                            Click to flip back
                        </small>
                        <button class="delete-flashcard" data-index="${index}">
    🗑️ Delete
</button>

                    </div>

                </div>

            `;


            flashcard.addEventListener(
    "click",
    function (event) {

        if (event.target.classList.contains("delete-flashcard")) {
            return;
        }

        flashcard.classList.toggle("flipped");
    }
);
flashcard
    .querySelector(".delete-flashcard")
    .addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            const confirmed = confirm(
                "Delete this flashcard?"
            );

            if (!confirmed) return;

            selectedChapter.flashcards.splice(index, 1);

            localStorage.setItem(
                "classes",
                JSON.stringify(myClasses)
            );

            displayFlashcards();
        }
    );


            container.appendChild(
                flashcard
            );

        }
    );
}
// =============================
// FLASHCARD STUDY MODE
// =============================

let studyCardIndex = 0;

function openStudyMode() {

    if (!selectedChapter || selectedChapter.flashcards.length === 0) {
        alert("There are no flashcards to study yet!");
        return;
    }

    studyCardIndex = 0;

    showStudyCard();

    document
        .getElementById("studyMode")
        .classList.remove("hidden");

    document
        .getElementById("studyMode")
        .requestFullscreen();
}


function showStudyCard() {

    const cards = selectedChapter.flashcards;

    const card = cards[studyCardIndex];

    document.getElementById("studyCardNumber").textContent =
        `${studyCardIndex + 1} / ${cards.length}`;

    document.getElementById("studyQuestion").textContent =
        card.question;

    document.getElementById("studyAnswer").textContent =
        card.answer;

    document
        .getElementById("studyAnswer")
        .classList.add("hidden");

    document.getElementById("studyQuestion").classList.remove("hidden");
}


document
    .getElementById("studyCard")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("studyAnswer")
                .classList.toggle("hidden");

        }
    );


document
    .getElementById("studyNext")
    .addEventListener(
        "click",
        function () {

            if (
                studyCardIndex <
                selectedChapter.flashcards.length - 1
            ) {

                studyCardIndex++;

                showStudyCard();
            }
        }
    );


document
    .getElementById("studyPrevious")
    .addEventListener(
        "click",
        function () {

            if (studyCardIndex > 0) {

                studyCardIndex--;

                showStudyCard();
            }
        }
    );


document
    .getElementById("exitStudyMode")
    .addEventListener(
        "click",
        function () {

            if (document.fullscreenElement) {
                document.exitFullscreen();
            }

            document
                .getElementById("studyMode")
                .classList.add("hidden");
        }
    );

// ADD FLASHCARD
// =========================

const flashcardForm =
    document.getElementById("flashcardForm");

document
    .getElementById("addFlashcardButton")
    .addEventListener("click", function () {

        flashcardForm.classList.remove("hidden");

    });

document
    .getElementById("cancelFlashcardButton")
    .addEventListener("click", function () {

        flashcardForm.classList.add("hidden");

    });

document
    .getElementById("saveFlashcardButton")
    .addEventListener("click", function () {

        const question =
            document.getElementById("flashcardQuestion").value.trim();

        const answer =
            document.getElementById("flashcardAnswer").value.trim();

        if (!question || !answer) {
            alert("Please enter both a question and an answer.");
            return;
        }

        selectedChapter.flashcards.push({
            question: question,
            answer: answer
        });

        localStorage.setItem(
            "classes",
            JSON.stringify(myClasses)
        );

        document.getElementById("flashcardQuestion").value = "";
        document.getElementById("flashcardAnswer").value = "";

        flashcardForm.classList.add("hidden");

        displayFlashcards();
    });


// BACK TO CHAPTERS
// =========================

document
    .getElementById("backToChapters")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("flashcardView")
                .classList.add("hidden");

            document
                .getElementById("classDetails")
                .classList.remove("hidden");

            selectedChapter = null;

        });
        // =============================
// FULLSCREEN FLASHCARDS
// =============================
// =================================
// =================================
// GLOBAL POMODORO TIMER
// =================================

let pomodoroTime = 25 * 60;
let pomodoroInterval = null;
let pomodoroRunning = false;
let pomodoroMode = "study";
let pomodoroSessions = 0;


// =================================
// UPDATE TIMER DISPLAY
// =================================

function updatePomodoroDisplay() {

    const timer = document.getElementById("pomodoroTimer");

    if (!timer) return;

    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;

    timer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    const mode =
        document.getElementById("pomodoroMode");

    if (mode) {

        mode.textContent =
            pomodoroMode === "study"
                ? "📚 Study Time"
                : "☕ Break Time";
    }


    const sessions =
        document.getElementById("pomodoroSessions");

    if (sessions) {

        sessions.textContent =
            "Sessions completed: " +
            pomodoroSessions;
    }
}


// =================================
// START
// =================================

function startPomodoro() {

    if (pomodoroRunning) return;

    pomodoroRunning = true;

    pomodoroInterval = setInterval(function () {

        pomodoroTime--;

        updatePomodoroDisplay();


        if (pomodoroTime <= 0) {

            clearInterval(pomodoroInterval);

            pomodoroInterval = null;

            pomodoroRunning = false;


            if (pomodoroMode === "study") {

                pomodoroSessions++;

                pomodoroMode = "break";

                pomodoroTime = 5 * 60;

                alert(
                    "🎉 Study session complete! Time for a 5 minute break!"
                );

            } else {

                pomodoroMode = "study";

                pomodoroTime = 25 * 60;

                alert(
                    "📚 Break finished! Time to study!"
                );
            }

            updatePomodoroDisplay();
        }

    }, 1000);
}


// =================================
// PAUSE
// =================================

function pausePomodoro() {

    clearInterval(pomodoroInterval);

    pomodoroInterval = null;

    pomodoroRunning = false;
}


// =================================
// RESET
// =================================

function resetPomodoro() {

    pausePomodoro();

    if (pomodoroMode === "study") {

        pomodoroTime = 25 * 60;

    } else {

        pomodoroTime = 5 * 60;
    }

    updatePomodoroDisplay();
}


// =================================
// DASHBOARD BUTTONS
// =================================

const pomodoroStart =
    document.getElementById("pomodoroStart");

if (pomodoroStart) {

    pomodoroStart.addEventListener(
        "click",
        startPomodoro
    );
}


const pomodoroPause =
    document.getElementById("pomodoroPause");

if (pomodoroPause) {

    pomodoroPause.addEventListener(
        "click",
        pausePomodoro
    );
}


const pomodoroReset =
    document.getElementById("pomodoroReset");

if (pomodoroReset) {

    pomodoroReset.addEventListener(
        "click",
        resetPomodoro
    );
}


// =================================
// STUDY / BREAK BUTTONS
// =================================

const pomodoroStudy =
    document.getElementById("pomodoroStudy");

if (pomodoroStudy) {

    pomodoroStudy.addEventListener(
        "click",
        function () {

            pausePomodoro();

            pomodoroMode = "study";

            pomodoroTime = 25 * 60;

            updatePomodoroDisplay();
        }
    );
}


const pomodoroBreak =
    document.getElementById("pomodoroBreak");

if (pomodoroBreak) {

    pomodoroBreak.addEventListener(
        "click",
        function () {

            pausePomodoro();

            pomodoroMode = "break";

            pomodoroTime = 5 * 60;

            updatePomodoroDisplay();
        }
    );
}


updatePomodoroDisplay();
