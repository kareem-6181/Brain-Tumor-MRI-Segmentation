
/* =========================================================
   BRAIN TUMOR MRI SEGMENTATION
   Main JavaScript
   Premium Frontend Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const body = document.body;

    /* Splash */
    const splashScreen = document.getElementById("splashScreen");
    const siteWrapper = document.getElementById("siteWrapper");

    /* Navbar */
    const navbar = document.getElementById("navbar");
    const navMenu = document.getElementById("navMenu");
    const menuToggle = document.getElementById("menuToggle");

    /* Controls */
    const languageSwitch = document.getElementById("languageSwitch");
    const themeSwitch = document.getElementById("themeSwitch");

    /* Upload */
    const mriInput = document.getElementById("mriInput");
    const uploadZone = document.getElementById("uploadZone");
    const browseButton = document.getElementById("browseButton");
    const analyzeButton = document.getElementById("analyzeButton");
    const sampleButton = document.getElementById("sampleButton");

    /* Selected image */
    const selectedImagePanel =
        document.getElementById("selectedImagePanel");

    const selectedImagePreview =
        document.getElementById("selectedImagePreview");

    const selectedFileName =
        document.getElementById("selectedFileName");

    const removeImageButton =
        document.getElementById("removeImageButton");

    /* Processing */
    const processingPanel =
        document.getElementById("processingPanel");

    const processingProgressBar =
        document.getElementById("processingProgressBar");

    const processingStatus =
        document.getElementById("processingStatus");

    const processingPercentage =
        document.getElementById("processingPercentage");

    /* Results */
    const resultsPanel =
        document.getElementById("resultsPanel");

    const originalResult =
        document.getElementById("originalResult");

    const maskResult =
        document.getElementById("maskResult");

    const segmentedResult =
        document.getElementById("segmentedResult");

    const resultModel =
        document.getElementById("resultModel");

    const resultInputSize =
        document.getElementById("resultInputSize");

    const resultDevice =
        document.getElementById("resultDevice");

    const resultDimensions =
        document.getElementById("resultDimensions");

    const newAnalysisButton =
        document.getElementById("newAnalysisButton");

    /* Toast */
    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");


    /* =====================================================
       GLOBAL STATE
    ===================================================== */

    let selectedFile = null;

    let currentLanguage =
        localStorage.getItem("btms-language") || "en";

    let currentObjectURL = null;

    let isAnalyzing = false;


    /* =====================================================
       TRANSLATIONS
    ===================================================== */

    const messages = {

        en: {
            validImage:
                "Please select a valid MRI image.",

            largeImage:
                "The selected image is too large. Maximum size is 20 MB.",

            imageSelected:
                "MRI image selected successfully.",

            selectImage:
                "Please select an MRI image first.",

            preparing:
                "Preparing MRI image...",

            processing:
                "Processing...",

            runningAI:
                "Running AI segmentation...",

            completed:
                "Segmentation completed successfully.",

            segmentationSuccess:
                "MRI segmentation completed successfully.",

            invalidResponse:
                "The server returned an invalid response.",

            predictionFailed:
                "Prediction failed.",

            analysisError:
                "Something went wrong while analyzing the MRI.",

            sampleInfo:
                "Sample MRI images will be connected to the dataset section."
        },

        ar: {
            validImage:
                "يرجى اختيار صورة MRI صحيحة.",

            largeImage:
                "الصورة المختارة كبيرة جدًا. الحد الأقصى للحجم هو 20 ميجابايت.",

            imageSelected:
                "تم اختيار صورة MRI بنجاح.",

            selectImage:
                "يرجى اختيار صورة MRI أولًا.",

            preparing:
                "جاري تجهيز صورة MRI...",

            processing:
                "جاري المعالجة...",

            runningAI:
                "جاري تشغيل تقسيم الصورة باستخدام الذكاء الاصطناعي...",

            completed:
                "اكتمل تقسيم الصورة بنجاح.",

            segmentationSuccess:
                "تم تحليل وتقسيم صورة MRI بنجاح.",

            invalidResponse:
                "الخادم أرسل استجابة غير صحيحة.",

            predictionFailed:
                "فشل تحليل الصورة.",

            analysisError:
                "حدث خطأ أثناء تحليل صورة MRI.",

            sampleInfo:
                "سيتم ربط صور MRI التجريبية بقسم البيانات."
        }

    };


    function getMessage(key) {

        return (
            messages[currentLanguage] &&
            messages[currentLanguage][key]
        ) || messages.en[key] || "";

    }


    /* =====================================================
       SPLASH SCREEN
    ===================================================== */

    function startSplash() {

        if (!splashScreen) {

            if (siteWrapper) {

                siteWrapper.style.opacity = "1";
                siteWrapper.style.visibility = "visible";
                siteWrapper.style.pointerEvents = "auto";

            }

            return;
        }


        if (siteWrapper) {

            siteWrapper.style.opacity = "0";
            siteWrapper.style.visibility = "hidden";
            siteWrapper.style.pointerEvents = "none";

        }


        setTimeout(() => {

            splashScreen.classList.add(
                "splash-hidden"
            );


            if (siteWrapper) {

                siteWrapper.style.opacity = "1";
                siteWrapper.style.visibility = "visible";
                siteWrapper.style.pointerEvents = "auto";

            }


            setTimeout(() => {

                splashScreen.style.display = "none";

            }, 1000);

        }, 5000);

    }

    startSplash();


    /* =====================================================
       NAVIGATION MENU
    ===================================================== */

    if (menuToggle && navMenu) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    navMenu.classList.toggle("active");


                menuToggle.classList.toggle(
                    "active",
                    isOpen
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU
    ===================================================== */

    document
        .querySelectorAll("#navMenu a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (navMenu) {

                        navMenu.classList.remove(
                            "active"
                        );

                    }


                    if (menuToggle) {

                        menuToggle.classList.remove(
                            "active"
                        );


                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

        });


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    function updateNavbar() {

        if (!navbar) return;


        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");


            navbar.style.boxShadow =
                "0 15px 50px rgba(0,0,0,0.35)";

        } else {

            navbar.classList.remove("scrolled");


            navbar.style.boxShadow =
                "0 15px 50px rgba(0,0,0,0.20)";

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );


    updateNavbar();


    /* =====================================================
       LANGUAGE SYSTEM
    ===================================================== */

    function applyLanguage(language) {

        currentLanguage =
            language === "ar"
                ? "ar"
                : "en";


        document.documentElement.lang =
            currentLanguage;


        body.classList.toggle(
            "arabic",
            currentLanguage === "ar"
        );


        document.documentElement.dir =
            currentLanguage === "ar"
                ? "rtl"
                : "ltr";


        /*
         * Replace elements containing:
         *
         * data-en="English text"
         * data-ar="Arabic text"
         */

        document
            .querySelectorAll("[data-en]")
            .forEach(element => {

                const value =
                    currentLanguage === "ar"
                        ? element.getAttribute("data-ar")
                        : element.getAttribute("data-en");


                if (value !== null) {

                    element.innerHTML =
                        value;

                }

            });


        /*
         * Placeholders
         */

        document
            .querySelectorAll(
                "[data-placeholder-en]"
            )
            .forEach(element => {

                const placeholder =
                    currentLanguage === "ar"
                        ? element.getAttribute(
                            "data-placeholder-ar"
                        )
                        : element.getAttribute(
                            "data-placeholder-en"
                        );


                if (placeholder !== null) {

                    element.placeholder =
                        placeholder;

                }

            });


        localStorage.setItem(
            "btms-language",
            currentLanguage
        );


        /*
         * Language switch label
         */

        if (languageSwitch) {

            const textElement =
                languageSwitch.querySelector(
                    ".switch-text"
                );


            if (textElement) {

                textElement.textContent =
                    currentLanguage === "ar"
                        ? "EN"
                        : "AR";

            }

        }

    }


    if (languageSwitch) {

        languageSwitch.addEventListener(
            "click",
            () => {

                const nextLanguage =
                    currentLanguage === "en"
                        ? "ar"
                        : "en";


                applyLanguage(
                    nextLanguage
                );

            }
        );

    }


    applyLanguage(
        currentLanguage
    );


    /* =====================================================
       DARK / LIGHT MODE
    ===================================================== */

    const savedTheme =
        localStorage.getItem("btms-theme");


    /*
     * IMPORTANT:
     * CSS uses body.light-theme.
     */

    if (savedTheme === "light") {

        body.classList.add(
            "light-theme"
        );

    }


    function updateThemeIcon() {

        if (!themeSwitch) {
            return;
        }


        const icon =
            themeSwitch.querySelector(
                ".theme-icon"
            );


        if (!icon) {
            return;
        }


        icon.textContent =
            body.classList.contains(
                "light-theme"
            )
                ? "☀"
                : "☾";

    }


    updateThemeIcon();


    if (themeSwitch) {

        themeSwitch.addEventListener(
            "click",
            () => {

                body.classList.toggle(
                    "light-theme"
                );


                const isLight =
                    body.classList.contains(
                        "light-theme"
                    );


                localStorage.setItem(
                    "btms-theme",
                    isLight
                        ? "light"
                        : "dark"
                );


                updateThemeIcon();

            }
        );

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "active"
                            );


                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       PERFORMANCE SCORE BARS
    ===================================================== */

    const scoreBars =
        document.querySelectorAll(
            ".score-fill"
        );


    if ("IntersectionObserver" in window) {

        const scoreObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const bar =
                            entry.target;


                        const target =
                            bar.getAttribute(
                                "data-width"
                            );


                        if (target) {

                            setTimeout(() => {

                                bar.style.width =
                                    `${target}%`;

                            }, 150);

                        }


                        scoreObserver.unobserve(
                            bar
                        );

                    });

                },
                {
                    threshold: 0.4
                }
            );


        scoreBars.forEach(
            bar => {

                scoreObserver.observe(
                    bar
                );

            }
        );

    }


    /* =====================================================
       ARCHITECTURE INTERACTION
    ===================================================== */

    const architectureNodes =
        document.querySelectorAll(
            ".arch-node"
        );


    const architectureDetails =
        document.querySelectorAll(
            ".arch-detail-content"
        );


    function activateArchitecture(stage) {

        architectureNodes.forEach(
            node => {

                node.classList.toggle(
                    "active",
                    node.dataset.stage === stage
                );

            }
        );


        architectureDetails.forEach(
            detail => {

                detail.classList.toggle(
                    "active",
                    detail.dataset.detail === stage
                );

            }
        );

    }


    architectureNodes.forEach(
        node => {

            node.addEventListener(
                "click",
                () => {

                    const stage =
                        node.getAttribute(
                            "data-stage"
                        );


                    if (stage) {

                        activateArchitecture(
                            stage
                        );

                    }

                }
            );

        }
    );


    if (architectureNodes.length > 0) {

        const firstStage =
            architectureNodes[0].getAttribute(
                "data-stage"
            );


        if (firstStage) {

            activateArchitecture(
                firstStage
            );

        }

    }


    /* =====================================================
       MRI FILE VALIDATION
    ===================================================== */

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/tiff",
        "image/x-tiff"
    ];


    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".tif",
        ".tiff"
    ];


    function isValidImage(file) {

        if (!file) {
            return false;
        }


        const typeValid =
            allowedTypes.includes(
                file.type
            );


        const lowerName =
            file.name.toLowerCase();


        const extensionValid =
            allowedExtensions.some(
                extension =>
                    lowerName.endsWith(
                        extension
                    )
            );


        return (
            typeValid ||
            extensionValid
        );

    }


    /* =====================================================
       FILE SIZE VALIDATION
    ===================================================== */

    function isReasonableFileSize(file) {

        if (!file) {
            return false;
        }


        const maxSize =
            20 * 1024 * 1024;


        return file.size <= maxSize;

    }


    /* =====================================================
       SELECT FILE
    ===================================================== */

    function setSelectedFile(file) {

        if (!file) {
            return;
        }


        if (!isValidImage(file)) {

            showMessage(
                getMessage("validImage"),
                "error"
            );

            return;

        }


        if (!isReasonableFileSize(file)) {

            showMessage(
                getMessage("largeImage"),
                "error"
            );

            return;

        }


        selectedFile =
            file;


        /*
         * Release previous object URL
         */

        if (currentObjectURL) {

            URL.revokeObjectURL(
                currentObjectURL
            );

        }


        currentObjectURL =
            URL.createObjectURL(
                file
            );


        /*
         * Selected file name
         */

        if (selectedFileName) {

            selectedFileName.textContent =
                file.name;

        }


        /*
         * Preview
         */

        if (selectedImagePreview) {

            selectedImagePreview.src =
                currentObjectURL;

        }


        /*
         * SHOW SELECTED PANEL
         *
         * Important:
         * HTML uses the hidden attribute.
         */

        if (selectedImagePanel) {

            selectedImagePanel.hidden =
                false;


            selectedImagePanel.classList.add(
                "active"
            );


            selectedImagePanel.style.display =
                "";

        }


        /*
         * Enable analyze
         */

        setAnalyzeState(
            true
        );


        /*
         * Hide old processing/results
         */

        if (processingPanel) {

            processingPanel.hidden =
                true;


            processingPanel.classList.remove(
                "active"
            );

        }


        if (resultsPanel) {

            resultsPanel.hidden =
                true;


            resultsPanel.classList.remove(
                "active"
            );

        }


        showMessage(
            getMessage("imageSelected"),
            "info"
        );

    }


    /* =====================================================
       ANALYZE BUTTON STATE
    ===================================================== */

    function setAnalyzeState(enabled) {

        if (!analyzeButton) {
            return;
        }


        analyzeButton.disabled =
            !enabled;


        analyzeButton.style.opacity =
            enabled
                ? "1"
                : "0.5";


        analyzeButton.style.pointerEvents =
            enabled
                ? "auto"
                : "none";

    }


    /* =====================================================
       FILE INPUT
    ===================================================== */

    if (mriInput) {

        mriInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files &&
                    event.target.files[0];


                if (file) {

                    setSelectedFile(
                        file
                    );

                }

            }
        );

    }


    /* =====================================================
       BROWSE BUTTON
    ===================================================== */

    if (browseButton) {

        browseButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                if (mriInput) {

                    mriInput.click();

                }

            }
        );

    }


    /* =====================================================
       UPLOAD ZONE
    ===================================================== */

    if (uploadZone) {

        [
            "dragenter",
            "dragover"
        ].forEach(
            eventName => {

                uploadZone.addEventListener(
                    eventName,
                    event => {

                        event.preventDefault();
                        event.stopPropagation();


                        uploadZone.classList.add(
                            "dragover"
                        );

                    }
                );

            }
        );


        [
            "dragleave",
            "drop"
        ].forEach(
            eventName => {

                uploadZone.addEventListener(
                    eventName,
                    event => {

                        event.preventDefault();
                        event.stopPropagation();


                        uploadZone.classList.remove(
                            "dragover"
                        );

                    }
                );

            }
        );


        uploadZone.addEventListener(
            "drop",
            event => {

                const files =
                    event.dataTransfer.files;


                if (
                    !files ||
                    !files.length
                ) {
                    return;
                }


                setSelectedFile(
                    files[0]
                );

            }
        );


        uploadZone.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        "button"
                    ) ||
                    event.target.closest(
                        "label"
                    )
                ) {
                    return;
                }


                if (mriInput) {

                    mriInput.click();

                }

            }
        );

    }


    /* =====================================================
       REMOVE SELECTED IMAGE
    ===================================================== */

    if (removeImageButton) {

        removeImageButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();


                resetSelectedImage();

            }
        );

    }


    function resetSelectedImage() {

        selectedFile =
            null;


        if (currentObjectURL) {

            URL.revokeObjectURL(
                currentObjectURL
            );


            currentObjectURL =
                null;

        }


        if (mriInput) {

            mriInput.value =
                "";

        }


        if (selectedImagePreview) {

            selectedImagePreview.removeAttribute(
                "src"
            );

        }


        if (selectedFileName) {

            selectedFileName.textContent =
                "";

        }


        if (selectedImagePanel) {

            selectedImagePanel.hidden =
                true;


            selectedImagePanel.classList.remove(
                "active"
            );


            selectedImagePanel.style.display =
                "";

        }


        if (processingPanel) {

            processingPanel.hidden =
                true;


            processingPanel.classList.remove(
                "active"
            );

        }


        if (resultsPanel) {

            resultsPanel.hidden =
                true;


            resultsPanel.classList.remove(
                "active"
            );

        }


        setAnalyzeState(
            false
        );

    }


    /* =====================================================
       SAMPLE BUTTON
    ===================================================== */

    if (sampleButton) {

        sampleButton.addEventListener(
            "click",
            () => {

                showMessage(
                    getMessage("sampleInfo"),
                    "info"
                );

            }
        );

    }


    /* =====================================================
       ANALYZE BUTTON
    ===================================================== */

    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            async () => {

                if (isAnalyzing) {
                    return;
                }


                if (!selectedFile) {

                    showMessage(
                        getMessage("selectImage"),
                        "error"
                    );


                    return;

                }


                await analyzeMRI();

            }
        );

    }


    /* =====================================================
       MRI ANALYSIS
    ===================================================== */

    async function analyzeMRI() {

        if (
            !selectedFile ||
            isAnalyzing
        ) {
            return;
        }


        isAnalyzing =
            true;


        /*
         * Disable analyze button
         */

        setAnalyzeState(
            false
        );


        /*
         * Hide previous results
         */

        if (resultsPanel) {

            resultsPanel.hidden =
                true;


            resultsPanel.classList.remove(
                "active"
            );

        }


        /*
         * Show processing
         */

        if (processingPanel) {

            processingPanel.hidden =
                false;


            processingPanel.classList.add(
                "active"
            );

        }


        /*
         * Reset processing UI
         */

        resetProcessing();


        /*
         * Scroll to processing
         */

        if (processingPanel) {

            setTimeout(() => {

                processingPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 100);

        }


        try {

            /*
             * Frontend processing animation
             */

            await processStep(
                0,
                650,
                12
            );


            await processStep(
                1,
                850,
                28
            );


            await processStep(
                2,
                950,
                46
            );


            await processStep(
                3,
                900,
                62
            );


            /*
             * Send actual image to Flask
             */

            const formData =
                new FormData();


            formData.append(
                "image",
                selectedFile
            );


            updateProcessing(
                68,
                getMessage("runningAI")
            );


            const response =
                await fetch(
                    "/predict",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            let data;


            try {

                data =
                    await response.json();

            } catch {

                throw new Error(
                    getMessage(
                        "invalidResponse"
                    )
                );

            }


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    getMessage(
                        "predictionFailed"
                    )
                );

            }


            /*
             * Final processing steps
             */

            await processStep(
                4,
                650,
                84
            );


            await processStep(
                5,
                550,
                100
            );


            updateProcessing(
                100,
                getMessage("completed")
            );


            /*
             * Display results
             */

            displayResults(
                data
            );


        } catch (error) {

            console.error(
                "Prediction Error:",
                error
            );


            showMessage(
                error.message ||
                getMessage(
                    "analysisError"
                ),
                "error"
            );


            if (processingPanel) {

                processingPanel.hidden =
                    true;


                processingPanel.classList.remove(
                    "active"
                );

            }


        } finally {

            isAnalyzing =
                false;


            setAnalyzeState(
                Boolean(
                    selectedFile
                )
            );

        }

    }


    /* =====================================================
       PROCESSING UI
    ===================================================== */

    function getProcessingSteps() {

        return document.querySelectorAll(
            ".processing-step"
        );

    }


    function resetProcessing() {

        const steps =
            getProcessingSteps();


        steps.forEach(
            step => {

                step.classList.remove(
                    "active",
                    "complete"
                );

            }
        );


        updateProcessing(
            0,
            getMessage("preparing")
        );

    }


    function updateProcessing(
        percentage,
        status
    ) {

        const safePercentage =
            Math.max(
                0,
                Math.min(
                    100,
                    percentage
                )
            );


        if (processingProgressBar) {

            processingProgressBar.style.width =
                `${safePercentage}%`;


            processingProgressBar.value =
                safePercentage;

        }


        if (processingPercentage) {

            processingPercentage.textContent =
                `${Math.round(
                    safePercentage
                )}%`;

        }


        if (processingStatus) {

            processingStatus.textContent =
                status;

        }

    }


    function processStep(
        index,
        duration,
        percentage
    ) {

        return new Promise(
            resolve => {

                const steps =
                    getProcessingSteps();


                if (!steps[index]) {

                    if (
                        typeof percentage ===
                        "number"
                    ) {

                        updateProcessing(
                            percentage,
                            getMessage(
                                "processing"
                            )
                        );

                    }


                    setTimeout(
                        resolve,
                        duration
                    );


                    return;

                }


                /*
                 * Complete previous steps
                 */

                steps.forEach(
                    (step, i) => {

                        if (i < index) {

                            step.classList.remove(
                                "active"
                            );


                            step.classList.add(
                                "complete"
                            );

                        }

                    }
                );


                /*
                 * Activate current step
                 */

                steps[index].classList.add(
                    "active"
                );


                if (
                    typeof percentage ===
                    "number"
                ) {

                    updateProcessing(
                        percentage,
                        getMessage(
                            "processing"
                        )
                    );

                }


                setTimeout(() => {

                    steps[index].classList.remove(
                        "active"
                    );


                    steps[index].classList.add(
                        "complete"
                    );


                    resolve();

                }, duration);

            }
        );

    }


    /* =====================================================
       DISPLAY RESULTS
    ===================================================== */

    function displayResults(data) {

        if (!resultsPanel) {
            return;
        }


        const timestamp =
            Date.now();


        /*
         * Original image
         */

        if (
            originalResult &&
            data.original
        ) {

            originalResult.src =
                `${data.original}?t=${timestamp}`;

        }


        /*
         * Segmentation mask
         */

        if (
            maskResult &&
            data.mask
        ) {

            maskResult.src =
                `${data.mask}?t=${timestamp}`;

        }


        /*
         * Segmented result
         */

        if (
            segmentedResult &&
            data.result
        ) {

            segmentedResult.src =
                `${data.result}?t=${timestamp}`;

        }


        /*
         * Model
         */

        if (
            resultModel &&
            data.model
        ) {

            resultModel.textContent =
                data.model;

        }


        /*
         * Input size
         */

        if (resultInputSize) {

            resultInputSize.textContent =
                data.input_size ||
                "256 × 256";

        }


        /*
         * Device
         */

        if (
            resultDevice &&
            data.device
        ) {

            resultDevice.textContent =
                String(
                    data.device
                ).toUpperCase();

        }


        /*
         * Original dimensions
         */

        if (resultDimensions) {

            if (
                data.width &&
                data.height
            ) {

                resultDimensions.textContent =
                    `${data.width} × ${data.height}`;

            }

        }


        /*
         * Backward compatibility
         */

        const resultWidth =
            document.getElementById(
                "resultWidth"
            );


        const resultHeight =
            document.getElementById(
                "resultHeight"
            );


        if (
            resultWidth &&
            data.width
        ) {

            resultWidth.textContent =
                `${data.width}px`;

        }


        if (
            resultHeight &&
            data.height
        ) {

            resultHeight.textContent =
                `${data.height}px`;

        }


        /*
         * Hide processing
         */

        if (processingPanel) {

            processingPanel.hidden =
                true;


            processingPanel.classList.remove(
                "active"
            );

        }


        /*
         * Show results
         */

        resultsPanel.hidden =
            false;


        resultsPanel.classList.add(
            "active"
        );


        /*
         * Scroll to results
         */

        setTimeout(() => {

            resultsPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 300);


        showMessage(
            getMessage(
                "segmentationSuccess"
            ),
            "success"
        );

    }


    /* =====================================================
       NEW ANALYSIS
    ===================================================== */

    if (newAnalysisButton) {

        newAnalysisButton.addEventListener(
            "click",
            () => {

                resetSelectedImage();


                const demoSection =
                    document.getElementById(
                        "demo"
                    );


                if (demoSection) {

                    demoSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    }


    /* =====================================================
       MESSAGE / TOAST SYSTEM
    ===================================================== */

    function showMessage(
        message,
        type = "info"
    ) {

        /*
         * Use existing toast if available.
         */

        if (
            toast &&
            toastMessage
        ) {

            toastMessage.textContent =
                message;


            toast.classList.remove(
                "success",
                "error",
                "info",
                "show",
                "active"
            );


            toast.classList.add(
                type
            );


            void toast.offsetWidth;


            toast.classList.add(
                "show"
            );


            toast.classList.add(
                "active"
            );


            setTimeout(() => {

                toast.classList.remove(
                    "show",
                    "active"
                );

            }, 3200);


            return;

        }


        /*
         * Fallback toast
         */

        const oldMessage =
            document.querySelector(
                ".btms-message"
            );


        if (oldMessage) {
            oldMessage.remove();
        }


        const messageElement =
            document.createElement(
                "div"
            );


        messageElement.className =
            `btms-message ${type}`;


        messageElement.textContent =
            message;


        Object.assign(
            messageElement.style,
            {
                position: "fixed",
                bottom: "25px",
                left: "50%",
                transform:
                    "translateX(-50%)",
                zIndex: "999999",
                padding:
                    "14px 22px",
                borderRadius:
                    "12px",
                fontSize:
                    "12px",
                fontWeight:
                    "700",
                backdropFilter:
                    "blur(15px)",
                border:
                    "1px solid rgba(255,255,255,0.1)",
                background:
                    type === "error"
                        ? "rgba(183,28,28,0.94)"
                        : type === "success"
                            ? "rgba(20,100,70,0.94)"
                            : "rgba(20,20,20,0.94)",
                color: "#fff",
                boxShadow:
                    "0 15px 40px rgba(0,0,0,0.35)",
                opacity: "0",
                transition:
                    "opacity 0.3s ease"
            }
        );


        document.body.appendChild(
            messageElement
        );


        requestAnimationFrame(() => {

            messageElement.style.opacity =
                "1";

        });


        setTimeout(() => {

            messageElement.style.opacity =
                "0";


            setTimeout(() => {

                messageElement.remove();

            }, 300);

        }, 3000);

    }


    /* =====================================================
       IMAGE ERROR HANDLING
    ===================================================== */

    [
        originalResult,
        maskResult,
        segmentedResult,
        selectedImagePreview
    ].forEach(
        image => {

            if (!image) return;


            image.addEventListener(
                "error",
                () => {

                    console.warn(
                        "Could not load image:",
                        image.src
                    );

                }
            );

        }
    );


    /* =====================================================
       SMOOTH ANCHOR SCROLL
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            anchor => {

                anchor.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            anchor.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }


                        let target =
                            null;


                        try {

                            target =
                                document.querySelector(
                                    targetId
                                );

                        } catch {

                            return;

                        }


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                );

            }
        );


    /* =====================================================
       IMAGE LOADING STATE
    ===================================================== */

    document
        .querySelectorAll(
            "img"
        )
        .forEach(
            image => {

                if (image.complete) {

                    image.classList.add(
                        "loaded"
                    );

                }


                image.addEventListener(
                    "load",
                    () => {

                        image.classList.add(
                            "loaded"
                        );

                    }
                );

            }
        );


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Escape closes mobile menu
             */

            if (
                event.key === "Escape"
            ) {

                if (navMenu) {

                    navMenu.classList.remove(
                        "active"
                    );

                }


                if (menuToggle) {

                    menuToggle.classList.remove(
                        "active"
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            /*
             * Close mobile menu when
             * returning to desktop.
             */

            if (
                window.innerWidth > 900 &&
                navMenu
            ) {

                navMenu.classList.remove(
                    "active"
                );


                if (menuToggle) {

                    menuToggle.classList.remove(
                        "active"
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        },
        { passive: true }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    setAnalyzeState(
        false
    );


    /*
     * IMPORTANT:
     * The HTML uses the hidden attribute.
     * Therefore we must control the panels
     * through .hidden instead of only display.
     */

    if (selectedImagePanel) {

        selectedImagePanel.hidden =
            true;

    }


    if (processingPanel) {

        processingPanel.hidden =
            true;

    }


    if (resultsPanel) {

        resultsPanel.hidden =
            true;

    }


    console.log(
        "%c🧠 Brain Tumor MRI Segmentation",
        "color:#e53935;font-size:18px;font-weight:900;"
    );


    console.log(
        "%cMedical AI System Initialized",
        "color:#00d9ff;font-size:12px;"
    );

});