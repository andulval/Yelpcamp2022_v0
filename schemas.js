const BaseJoi = require('joi');//package to validate created schema before data is send to mongoose, można stworzyc schema z wytycznymi a potem sprawdzic wywołując vaildate - wyrzuci specyficzne błedy jesli cos nie tak
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({ //add method do joi sprawdzajace czy ktos nie wysyla czesci html jak <script>
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.campgroundSchema = Joi.object({
  // w tej funkcji ten obiekt jest redefiniowany za każdym razem, dlatego lepiej byłoby go załączzyć jako plik, aby nie powtażać definicji przy każdym wywoołaniu funkcji
  //tworaymy schema do sprawdzenia przez Joi
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    // images: Joi.string().required(),
  }).required(), //jest wymagany cały obiekt
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(), //jest wymagany cały obiekt
});
