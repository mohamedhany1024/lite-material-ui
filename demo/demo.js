const jobs = [
	{ jobId: "JOB-1042", title: "Kitchen sink replacement", client: "Cobol", status: "In progress", due: "12 / 03 / 2026", total: "4200 EGP" },
	{ jobId: "JOB-1088", title: "AC unit maintenance", client: "Lorem", status: "Scheduled", due: "18 / 03 / 2026", total: "1150 EGP" },
	{ jobId: "JOB-1120", title: "Wiring inspection", client: "Ipsum", status: "Completed", due: "02 / 03 / 2026", total: "2800 EGP" },
];

const jobsList = new action("jobsList", [], (params) => {
	openScreen("main");
});

const jobDetailsOpen = new action("jobDetailsOpen", ["jobId"], (params) => {
	let job = getJob(params.get("jobId"));
	if (job == null) {
		pushToast("Unknown job: " + params.get("jobId"), 3000);
		performAction("jobsList", { jobId: null });
		return;
	}
	openScreen("jobDetails");
	renderJobDetails(job);
});

function getJob(jobId) {
	return jobs.find((job) => job.jobId === jobId);
}

function renderJobs() {
	document.getElementById("jobList").innerHTML = jobs.map((job) => `
		<div class="card3 jobCard" data-job-id="${job.jobId}">
			<p class="jobCard__title">${job.title}</p>
			<p class="jobCard__sub">${job.jobId} &middot; ${job.client}</p>
			<p class="jobCard__badge">${job.status}</p>
		</div>
	`).join("");
	//cards rendered on the fly need their ripples bound afterwards
	appendRipples();
}

function renderJobDetails(job) {
	document.getElementById("jobDetailsTitle").innerText = job.title;
	document.getElementById("jobDetailsBody").innerHTML = `
		<div class="divider"></div>
		<p><b>Job id:</b> ${job.jobId}</p>
		<p><b>Client:</b> ${job.client}</p>
		<p><b>Status:</b> ${job.status}</p>
		<p><b>Due date:</b> ${job.due}</p>
		<p><b>Total:</b> ${job.total}</p>
		<div class="divider"></div>
		<p>Share this page, whoever opens the link lands on this same job.</p>
		<input type="text" class="editText" id="shareLink" readonly>
	`;
	document.getElementById("shareLink").value = window.location.href;
}

document.addEventListener("click", (event) => {
	let card = event.target.closest(".jobCard");
	if (card != null) {
		//performing the action both renders the state and writes it into the url
		performAction("jobDetailsOpen", { jobId: card.dataset.jobId });
	}
});

document.getElementById("copyLink").addEventListener("click", () => {
	let field = document.getElementById("shareLink");
	if (field == null) {
		return;
	}
	let link = field.value;
	let report = (ok) => pushToast(ok ? "Link copied to clipboard" : "Copy it manually: " + link, 3000);
	if (navigator.clipboard == null) {
		report(false);
	} else {
		navigator.clipboard.writeText(link).then(() => report(true), () => report(false));
	}
});

renderJobs();
