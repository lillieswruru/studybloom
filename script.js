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
let selectedDrink = "iced-matcha";
let audioContext = null;

const drinkRecipes = {
    "iced-matcha": {
        name: "Iced Matcha",
        icon: "🍵",
        liquid: "#a9c78b",
        message: "Matcha is slowly coming together..."
    },
    "iced-coffee": {
        name: "Iced Coffee",
        icon: "🧊",
        liquid: "#9a765f",
        message: "Coffee is chilling while you focus..."
    },
    "coffee": {
        name: "Coffee",
        icon: "☕",
        liquid: "#704b38",
        message: "Your coffee is brewing..."
    },
    "matcha": {
        name: "Matcha",
        icon: "🍵",
        liquid: "#8fb66f",
        message: "Whisking a little matcha for you..."
    }
};

// =================================
// LITTLE CAFÉ BELL
// Uses the browser's Web Audio API, so no sound file is needed.
// =================================

function playCafeBell() {
    try {
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const now = audioContext.currentTime;
        const notes = [880, 1318.51];

        notes.forEach(function (frequency, index) {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency, now);
            oscillator.frequency.exponentialRampToValueAtTime(
                frequency * 0.92,
                now + 1.2
            );

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(
                0.22,
                now + 0.02 + index * 0.08
            );
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + 1.35
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start(now + index * 0.08);
            oscillator.stop(now + 1.4);
        });
    } catch (error) {
        console.log("Bell sound could not play.", error);
    }
}

// =================================
// DRINK UI
// =================================

function updateDrinkDisplay() {
    const recipe = drinkRecipes[selectedDrink];
    if (!recipe) return;

    const liquid = document.getElementById("cupLiquid");
    const ice = document.getElementById("cupIce");
    const steam = document.getElementById("brewSteam");
    const message = document.getElementById("brewMessage");

    if (liquid) {
        liquid.style.background = recipe.liquid;
    }

    if (ice) {
        ice.style.display = selectedDrink.includes("iced") ? "block" : "none";
    }

    if (steam) {
        steam.style.display = selectedDrink.includes("iced") ? "none" : "block";
    }

    if (message && !pomodoroRunning) {
        message.textContent =
            pomodoroMode === "study"
                ? "Your drink will brew while you focus."
                : "Take a little break and enjoy your drink.";
    }

    updateDrinkProgress();
}

function updateDrinkProgress() {
    const liquid = document.getElementById("cupLiquid");
    if (!liquid) return;

    const maxTime = pomodoroMode === "study" ? 25 * 60 : 5 * 60;
    const elapsed = Math.max(0, maxTime - pomodoroTime);
    const progress = Math.min(100, (elapsed / maxTime) * 100);

    liquid.style.height = Math.max(22, 22 + progress * 0.68) + "%";
}

function selectDrink(drink) {
    if (!drinkRecipes[drink]) return;

    selectedDrink = drink;

    document.querySelectorAll(".drink-option").forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.drink === selectedDrink
        );
    });

    const card = document.querySelector(".pomodoro-card");
    if (card) card.classList.remove("drink-ready");

    updateDrinkDisplay();
}

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

    const mode = document.getElementById("pomodoroMode");
    if (mode) {
        mode.textContent =
            pomodoroMode === "study"
                ? "📚 Study Time"
                : "🌷 Break Time";
    }

    const sessions = document.getElementById("pomodoroSessions");
    if (sessions) {
        sessions.textContent =
            "Sessions completed: " + pomodoroSessions;
    }

    updateDrinkProgress();
}

// =================================
// START
// =================================

function startPomodoro() {
    if (pomodoroRunning) return;

    // Creating/resuming the audio context here means the browser allows
    // the completion bell later in the session.
    try {
        audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === "suspended") audioContext.resume();
    } catch (error) {
        console.log("Audio is not available in this browser.");
    }

    pomodoroRunning = true;

    const status = document.getElementById("pomodoroStatus");
    const stage = document.getElementById("brewStage");
    const message = document.getElementById("brewMessage");

    if (status) status.textContent = "Brewing...";
    if (stage) stage.classList.add("brewing");
    if (message) {
        message.textContent =
            pomodoroMode === "study"
                ? drinkRecipes[selectedDrink].message
                : "Resting... your drink is waiting for you.";
    }

    pomodoroInterval = setInterval(function () {
        pomodoroTime--;
        updatePomodoroDisplay();

        if (pomodoroTime <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            pomodoroRunning = false;

            playCafeBell();

            const card = document.querySelector(".pomodoro-card");
            if (card) card.classList.add("drink-ready");

            if (pomodoroMode === "study") {
                pomodoroSessions++;
                pomodoroMode = "break";
                pomodoroTime = 5 * 60;

                if (status) status.textContent = "Ready ✦";
                if (message) {
                    message.textContent =
                        drinkRecipes[selectedDrink].name + " is ready! Enjoy your break. 🔔";
                }
            } else {
                pomodoroMode = "study";
                pomodoroTime = 25 * 60;

                if (status) status.textContent = "Ready";
                if (message) {
                    message.textContent = "Break finished. Ready to brew another one?";
                }
            }

            if (stage) stage.classList.remove("brewing");
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

    const status = document.getElementById("pomodoroStatus");
    const stage = document.getElementById("brewStage");

    if (status) status.textContent = "Paused";
    if (stage) stage.classList.remove("brewing");
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

    const card = document.querySelector(".pomodoro-card");
    const status = document.getElementById("pomodoroStatus");
    const message = document.getElementById("brewMessage");

    if (card) card.classList.remove("drink-ready");
    if (status) status.textContent = "Ready";
    if (message) message.textContent = "Your drink will brew while you focus.";

    updatePomodoroDisplay();
    updateDrinkDisplay();
}

// =================================
// DASHBOARD BUTTONS
// =================================

const pomodoroStart = document.getElementById("pomodoroStart");
if (pomodoroStart) pomodoroStart.addEventListener("click", startPomodoro);

const pomodoroPause = document.getElementById("pomodoroPause");
if (pomodoroPause) pomodoroPause.addEventListener("click", pausePomodoro);

const pomodoroReset = document.getElementById("pomodoroReset");
if (pomodoroReset) pomodoroReset.addEventListener("click", resetPomodoro);

// =================================
// DRINK SELECTOR
// =================================

document.querySelectorAll(".drink-option").forEach(function (button) {
    button.addEventListener("click", function () {
        if (pomodoroRunning) return;
        selectDrink(button.dataset.drink);
    });
});

// =================================
// STUDY / BREAK BUTTONS
// =================================

const pomodoroStudy = document.getElementById("pomodoroStudy");
if (pomodoroStudy) {
    pomodoroStudy.addEventListener("click", function () {
        pausePomodoro();
        pomodoroMode = "study";
        pomodoroTime = 25 * 60;

        const status = document.getElementById("pomodoroStatus");
        if (status) status.textContent = "Ready";

        updatePomodoroDisplay();
        updateDrinkDisplay();
    });
}

const pomodoroBreak = document.getElementById("pomodoroBreak");
if (pomodoroBreak) {
    pomodoroBreak.addEventListener("click", function () {
        pausePomodoro();
        pomodoroMode = "break";
        pomodoroTime = 5 * 60;

        const status = document.getElementById("pomodoroStatus");
        if (status) status.textContent = "Ready";

        updatePomodoroDisplay();
        updateDrinkDisplay();
    });
}

updateDrinkDisplay();
updatePomodoroDisplay();



/* =========================
   PERSONAL NOTES SYSTEM
   ========================= */
(function(){
    const NOTES_KEY = "personalNotesV1";
    let notesData = JSON.parse(localStorage.getItem(NOTES_KEY) || "null") || {
        rootName: "Notes",
        chapterLabel: "Chapters",
        subjects: []
    };
    let selectedSubject = null;
    let selectedChapter = null;
    let quiz = null;

    const $ = id => document.getElementById(id);
    const save = () => localStorage.setItem(NOTES_KEY, JSON.stringify(notesData));

    function ensureNotesPage(){
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
        const page = $("notesPage");
        if(page) page.classList.add("active-page");
        document.querySelectorAll(".nav-button").forEach(b => b.classList.remove("active"));
        document.querySelector('[data-page="notes"]')?.classList.add("active");
    }

    function renderSubjects(){
        const list = $("notesSubjectList");
        if(!list) return;
        list.innerHTML = "";
        if(notesData.subjects.length === 0){
            list.innerHTML = '<p style="opacity:.55;font-size:13px;padding:8px">No subjects yet.</p>';
            return;
        }
        notesData.subjects.forEach(subject => {
            const item = document.createElement("div");
            item.className = "notes-subject-item" + (selectedSubject?.id === subject.id ? " active" : "");
            item.innerHTML = `<span>📁 ${escapeHtml(subject.name)}</span><small>${subject.chapters.length}</small>`;
            item.addEventListener("click", () => openSubject(subject.id));
            list.appendChild(item);
        });
    }

    function renderChapterList(){
        if(!selectedSubject) return;
        $("notesSubjectTitle").textContent = selectedSubject.name;
        $("notesSelectedSubjectName").textContent = selectedSubject.name;
        $("notesChapterLabel").textContent = notesData.chapterLabel;
        const container = $("notesChapterList");
        container.innerHTML = "";
        if(selectedSubject.chapters.length === 0){
            container.innerHTML = `<div class="notes-empty-state" style="grid-column:1/-1;padding:60px 15px">
                <div class="notes-empty-icon">📝</div><h2>No ${escapeHtml(notesData.chapterLabel.toLowerCase())} yet</h2>
                <p>Create your first one and start writing.</p></div>`;
            return;
        }
        selectedSubject.chapters.forEach((chapter,index) => {
            const card = document.createElement("div");
            card.className = "notes-chapter-card";
            card.innerHTML = `<div class="chapter-number">${escapeHtml(notesData.chapterLabel.slice(0,-1).toUpperCase() || "CHAPTER")} ${index+1}</div>
                <h3>${escapeHtml(chapter.name)}</h3>
                <p>${chapter.content ? "✎ Notes saved" : "Empty note"}</p>`;
            card.addEventListener("click", () => openChapter(chapter.id));
            container.appendChild(card);
        });
    }

    function openSubject(id){
        selectedSubject = notesData.subjects.find(s => s.id === id);
        if(!selectedSubject) return;
        selectedChapter = null;
        $("notesEmptyState").classList.add("hidden");
        $("notesEditorView").classList.add("hidden");
        $("notesSubjectView").classList.remove("hidden");
        renderSubjects(); renderChapterList();
    }

    function openChapter(id){
        selectedChapter = selectedSubject.chapters.find(c => c.id === id);
        if(!selectedChapter) return;
        $("notesSubjectView").classList.add("hidden");
        $("notesEditorView").classList.remove("hidden");
        $("notesEditorSubjectName").textContent = selectedSubject.name;
        $("notesEditorChapterName").textContent = selectedChapter.name;
        $("notesTitleInput").value = selectedChapter.title || selectedChapter.name;
        $("notesEditor").innerHTML = selectedChapter.content || "";
        $("notesSaveStatus").textContent = "Saved locally";
    }

    function addSubject(){
        const name = prompt("Subject name:");
        if(!name?.trim()) return;
        const subject = {id: Date.now(), name:name.trim(), chapters:[]};
        notesData.subjects.push(subject); save();
        renderSubjects(); openSubject(subject.id);
    }

    function addChapter(){
        if(!selectedSubject) return;
        const name = prompt(`${notesData.chapterLabel.slice(0,-1) || "Chapter"} name:`);
        if(!name?.trim()) return;
        const description = prompt("Short description (optional):") || "";
        const chapter = {id:Date.now(), name:name.trim(), title:name.trim(), description:description.trim(), content:"", quizHistory:[]};
        selectedSubject.chapters.push(chapter); save(); renderChapterList(); openChapter(chapter.id);
    }

    function renameSubject(){
        if(!selectedSubject) return;
        const name = prompt("Rename subject:", selectedSubject.name);
        if(!name?.trim()) return;
        selectedSubject.name=name.trim(); save(); renderSubjects(); renderChapterList();
        $("notesEditorSubjectName").textContent = selectedSubject.name;
    }

    function renameChapter(){
        if(!selectedChapter) return;
        const name = prompt(`Rename ${notesData.chapterLabel.slice(0,-1).toLowerCase() || "chapter"}:`, selectedChapter.name);
        if(!name?.trim()) return;
        selectedChapter.name=name.trim(); selectedChapter.title=selectedChapter.title || name.trim();
        save(); $("notesEditorChapterName").textContent=selectedChapter.name; renderChapterList();
    }

    function deleteChapter(){
        if(!selectedSubject || !selectedChapter) return;
        if(!confirm(`Delete "${selectedChapter.name}" and all of its notes?`)) return;
        selectedSubject.chapters = selectedSubject.chapters.filter(c=>c.id!==selectedChapter.id);
        save(); selectedChapter=null; $("notesEditorView").classList.add("hidden"); $("notesSubjectView").classList.remove("hidden"); renderChapterList(); renderSubjects();
    }

    function exec(command, value=null){
        document.execCommand(command,false,value);
        $("notesEditor").focus(); scheduleSave();
    }

    function applyFontSize(px){
        document.execCommand("fontSize", false, "7");
        $("notesEditor").querySelectorAll('font[size="7"]').forEach(el=>{
            el.removeAttribute("size"); el.style.fontSize=px+"pt";
        });
        $("notesEditor").focus(); scheduleSave();
    }

    let saveTimer;
    function scheduleSave(){
        clearTimeout(saveTimer);
        saveTimer=setTimeout(saveEditor,350);
    }
    function saveEditor(){
        if(!selectedChapter) return;
        selectedChapter.title=$("notesTitleInput").value.trim() || selectedChapter.name;
        selectedChapter.content=$("notesEditor").innerHTML;
        save(); $("notesSaveStatus").textContent="Saved locally";
        setTimeout(()=>{if($("notesSaveStatus")) $("notesSaveStatus").textContent="Saved locally";},700);
    }

    function escapeHtml(value){
        return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
    }

    // Local question generator: extracts sentence-like facts and turns them into simple recall/true-false questions.
    function buildQuestions(text, count){
        const plain = text.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
        const sentences = plain.split(/(?<=[.!?。！？])\s+/).map(s=>s.trim()).filter(s=>s.length>=35);
        const pool = [...new Set(sentences)];
        if(pool.length===0) return [];
        const questions=[];
        for(let i=0;i<Math.min(count,pool.length);i++){
            const sentence=pool[i];
            const words=sentence.split(/\s+/).filter(w=>w.length>3);
            const key=words[Math.floor(words.length/2)] || words[0];
            const masked=sentence.replace(key, "_____");
            questions.push({
                type:"recall",
                question:`Complete the statement from your notes:\n${masked}`,
                answer:key,
                source:sentence
            });
        }
        return questions;
    }

    function startQuiz(count, wrongOnly=false){
        if(!selectedChapter) return;
        let questions;
        if(wrongOnly && selectedChapter.quizHistory?.length){
            const last=selectedChapter.quizHistory[selectedChapter.quizHistory.length-1];
            questions=(last.questions||[]).filter(q=>!q.correct);
        } else {
            questions=buildQuestions($("notesEditor").innerText || "", count);
        }
        if(!questions.length){
            alert("I need a little more written text to make practice questions. Try adding a few complete sentences to this note.");
            return;
        }
        quiz={questions, index:0, score:0, answered:false, wrong:[]};
        $("notesQuizSetup").classList.add("hidden");
        $("notesQuizResult").classList.add("hidden");
        $("notesQuiz").classList.remove("hidden");
        showQuestion();
    }

    function showQuestion(){
        const q=quiz.questions[quiz.index];
        $("notesQuizProgress").textContent=`Question ${quiz.index+1} of ${quiz.questions.length}`;
        $("notesQuizScore").textContent=`Score: ${quiz.score}`;
        $("notesQuizQuestion").textContent=q.question;
        const options=$("notesQuizOptions"); options.innerHTML="";
        const input=document.createElement("input");
        input.className="notes-quiz-text-answer";
        input.placeholder="Type your answer...";
        input.autocomplete="off";
        input.style.cssText="width:100%;box-sizing:border-box;padding:12px;border:1px solid #e4d8dd;border-radius:12px;font:inherit";
        options.appendChild(input);
        quiz.input=input; quiz.answered=false;
        $("notesQuizCorrect").classList.remove("hidden");
        $("notesQuizWrong").classList.remove("hidden");
        $("notesQuizNext").classList.add("hidden");
        input.focus();
    }

    function markAnswer(correct){
        if(quiz.answered) return;
        quiz.answered=true;
        const q=quiz.questions[quiz.index];
        const typed=(quiz.input.value||"").trim().toLowerCase();
        // User can override with Correct/Wrong; typed answer is still stored.
        q.userAnswer=typed; q.correct=correct;
        if(correct) quiz.score++; else quiz.wrong.push(q);
        $("notesQuizScore").textContent=`Score: ${quiz.score}`;
        $("notesQuizCorrect").classList.add("hidden");
        $("notesQuizWrong").classList.add("hidden");
        $("notesQuizNext").classList.remove("hidden");
        $("notesQuizNext").textContent=quiz.index===quiz.questions.length-1 ? "See Score →" : "Next →";
    }

    function finishQuiz(){
        const total=quiz.questions.length, pct=Math.round(quiz.score/total*100);
        selectedChapter.quizHistory=selectedChapter.quizHistory||[];
        selectedChapter.quizHistory.push({
            date:new Date().toISOString(), score:quiz.score, total, percentage:pct,
            questions:quiz.questions.map(q=>({...q}))
        });
        save();
        $("notesQuiz").classList.add("hidden"); $("notesQuizResult").classList.remove("hidden");
        $("notesResultScore").textContent=pct+"%";
        $("notesResultDetails").textContent=`${quiz.score} correct out of ${total} questions.`;
        const wrongBox=$("notesWrongQuestions");
        wrongBox.innerHTML=quiz.wrong.length ? "<h3>Questions to review</h3>"+quiz.wrong.map(q=>`<div class="notes-wrong-item"><strong>${escapeHtml(q.question)}</strong><br><small>Expected: ${escapeHtml(q.answer)}</small></div>`).join("") : "<p>🎉 You got everything right!</p>";
        $("notesPracticeWrong").classList.toggle("hidden",quiz.wrong.length===0);
    }

    function openQuizModal(){
        if(!selectedChapter) return;
        saveEditor();
        $("notesQuestionModal").classList.remove("hidden");
        $("notesQuizSetup").classList.remove("hidden");
        $("notesQuiz").classList.add("hidden");
        $("notesQuizResult").classList.add("hidden");
        $("notesQuizIntro").textContent=`Practice ${selectedChapter.name} using the material in this note.`;
    }
$("notesEmptyAddSubject")?.addEventListener("click", addSubject);
    $("addNoteSubjectButton")?.addEventListener("click", addSubject);
    $("notesBackToSettings")?.addEventListener("click", ()=>{
        const target=document.querySelector('[data-page="dashboard"]');
        if(target) target.click();
    });
    $("notesBackToSubjects")?.addEventListener("click", ()=>{ $("notesSubjectView").classList.add("hidden"); $("notesEmptyState").classList.remove("hidden"); selectedSubject=null; renderSubjects(); });
    $("notesBackToSubject")?.addEventListener("click", ()=>{ saveEditor(); $("notesEditorView").classList.add("hidden"); $("notesSubjectView").classList.remove("hidden"); renderChapterList(); });
    $("addNotesChapterButton")?.addEventListener("click", addChapter);
    $("renameNotesSubjectButton")?.addEventListener("click", renameSubject);
    $("notesRenameChapterButton")?.addEventListener("click", renameChapter);
    $("notesDeleteChapterButton")?.addEventListener("click", deleteChapter);
    $("notesRenameRootButton")?.addEventListener("click", ()=>{
        const root=prompt("Rename Notes:",notesData.rootName); if(root?.trim()){notesData.rootName=root.trim();save();}
    });
    $("notesTitleInput")?.addEventListener("input",scheduleSave);
    $("notesEditor")?.addEventListener("input",scheduleSave);
    $("notesEditor")?.addEventListener("keydown",e=>{
        if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="s"){e.preventDefault();saveEditor();}
    });
    document.querySelectorAll("[data-command]").forEach(btn=>btn.addEventListener("mousedown",e=>e.preventDefault()));
    document.querySelectorAll("[data-command]").forEach(btn=>btn.addEventListener("click",()=>exec(btn.dataset.command)));
    $("notesFontFamily")?.addEventListener("change",e=>exec("fontName",e.target.value));
    $("notesFontSize")?.addEventListener("change",e=>applyFontSize(e.target.value));
    $("notesTextColor")?.addEventListener("input",e=>exec("foreColor",e.target.value));
    $("notesHighlightColor")?.addEventListener("input",e=>exec("hiliteColor",e.target.value));
    $("notesClearHighlight")?.addEventListener("click",()=>exec("hiliteColor","transparent"));
    $("notesGenerateQuestions")?.addEventListener("click",openQuizModal);
    $("closeNotesQuestionModal")?.addEventListener("click",()=>$("notesQuestionModal").classList.add("hidden"));
    $("startNotesQuizButton")?.addEventListener("click",()=>startQuiz(Number($("notesQuestionCount").value)));
    $("notesQuizCorrect")?.addEventListener("click",()=>markAnswer(true));
    $("notesQuizWrong")?.addEventListener("click",()=>markAnswer(false));
    $("notesQuizNext")?.addEventListener("click",()=>{if(quiz.index===quiz.questions.length-1)finishQuiz();else{quiz.index++;showQuestion();}});
    $("notesPracticeWrong")?.addEventListener("click",()=>startQuiz(quiz.wrong.length,true));
    $("notesCloseResult")?.addEventListener("click",()=>$("notesQuestionModal").classList.add("hidden"));
    });

    // Initial rendering.
    renderSubjects();
})();
