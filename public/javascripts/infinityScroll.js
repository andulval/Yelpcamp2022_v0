const loading = document.querySelector('.loading');
const nodesContainer = document.querySelectorAll('.container');
// var firstCard = nodesContainer[0];
const lastCard = nodesContainer[nodesContainer.length - 1];

const allCampgrounds = campgrounds.features;
let countCampgrounds = 3; //to count wichch campground load now
// getPost();
// getPost();
// getPost();
const loadMoreBt = document.querySelector("#loadMoreBt");


window.addEventListener('scroll', () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	
	// console.log( { scrollTop, scrollHeight, clientHeight });
	
	if (clientHeight + scrollTop >= scrollHeight - 5) {
		if (allCampgrounds.length > countCampgrounds) {
			// show the loading animation
			showLoading();
		}
	}
});

loadMoreBt.addEventListener('click', () => {
	for (let i = 0; i < 3; i++) {
		if (allCampgrounds.length >= countCampgrounds) {
		// show the loading animation
		showLoading();
		if (allCampgrounds.length === countCampgrounds) {
			loadMoreBt.classList.add('none');
		}
	}
	}
	
});

function showLoading() {
	loading.classList.add('show');
	
	// load more data
	setTimeout(getCampground, 1000)
}

async function getCampground() {
	// const nextCampground = await Campground.find({});
	if (allCampgrounds.length > countCampgrounds) {
	const campToShow = allCampgrounds[countCampgrounds];
	countCampgrounds++;
	await addDataToDOM(campToShow);
	}
	else if (allCampgrounds.length === countCampgrounds) {
			const postElement = await document.createElement('div');
	postElement.classList.add('d-flex', 'mt-5', 'justify-content-center');
	postElement.innerHTML = `
					<p><b>You've just reached the end!<b></p>
		`;
	lastCard.appendChild(postElement);
	}
}

function addDataToDOM(campToShow) {
	
	const postElement = document.createElement('div');
	postElement.classList.add('card', 'mb-5', 'shadow', "rounded");
	postElement.innerHTML = `
                    <div class="row">
                        <div class="col-md-4 d-flex justify-content-center rounded">
                                <img src="${campToShow.images[0].url}" class="showPageImage img-fluid my-auto rounded" alt="${campToShow.images[0].filename}" crossorigin>
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a href="/campgrounds/${campToShow._id}">
                                        ${campToShow.title}
                                    </a>
                                </h5>
                                <p class="card-text">
                                    ${campToShow.description}
                                </p>
                                <p class="card-text"><small class="text-muted">
                                        ${campToShow.location}
                                    </small></p>
                                <a href="/campgrounds/${campToShow._id}" class="btn btn-primary">View more</a>
                            </div>

                        </div>
                    </div>
		`;
	lastCard.appendChild(postElement);
	
	loading.classList.remove('show');
}


