export class BaseApi {
	private baseUrl: string;

	constructor(basePath: string) {
		this.baseUrl = import.meta.env.VITE_API_URL + basePath;
	}

	protected async get<T>(url: string, params?: Record<string, string>): Promise<T> {
		const queryParams = params ? new URLSearchParams(params).toString() : '';
		const requestUrl = `${this.baseUrl}${url}${queryParams ? `?${queryParams}` : ''}`;

		const response = await fetch(requestUrl, {
			method: 'GET',
			headers: this.getHeaders(),
			credentials: 'include',
		});

		return this.handleResponse<T>(response);
	}

	protected async post<T>(url: string, data?: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'POST',
			headers: this.getHeaders(),
			credentials: 'include',
			body: data ? JSON.stringify(data) : undefined,
		});

		return this.handleResponse<T>(response);
	}

	protected async put<T>(url: string, data: any): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'PUT',
			headers: this.getHeaders(),
			credentials: 'include',
			body: JSON.stringify(data),
		});

		return this.handleResponse<T>(response);
	}

	protected async delete<T>(url: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'DELETE',
			headers: this.getHeaders(),
			credentials: 'include',
		});

		return this.handleResponse<T>(response);
	}

	private getHeaders(): HeadersInit {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		};

		const token = localStorage.getItem('token');
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				message: 'Неизвестная ошибка',
			}));

			throw new Error(errorData.message || `Ошибка запроса: ${response.status}`);
		}

		// Для 204 No Content возвращаем пустой объект
		if (response.status === 204) {
			return {} as T;
		}

		return response.json();
	}
}
