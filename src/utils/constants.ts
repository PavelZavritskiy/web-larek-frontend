export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    headers: {
		'Content-Type': 'application/json',
	},
};

type CategoryColorType = {
  [key: string]: string;
};

export const CategoryColor: CategoryColorType = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
  'кнопка': 'card__category_button',
};