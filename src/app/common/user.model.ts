export class User {
    private name: string;
    private age: Number;
    private country: string;
    private state: string;
    private role: string;
    private club: string;
    private email: string;
    private imgUrl: string;
    private phone: string;
    
    private interests: string[];
    private userId: string;


    /**
     * Getter $role
     * @return {string}
     */
	public get $role(): string {
		return this.role;
	}

    /**
     * Getter $club
     * @return {string}
     */
	public get $club(): string {
		return this.club;
	}

    /**
     * Getter $interests
     * @return {string[]}
     */
	public get $interests(): string[] {
		return this.interests;
	}

    /**
     * Setter $role
     * @param {string} value
     */
	public set $role(value: string) {
		this.role = value;
	}

    /**
     * Setter $club
     * @param {string} value
     */
	public set $club(value: string) {
		this.club = value;
	}

    /**
     * Setter $interests
     * @param {string[]} value
     */
	public set $interests(value: string[]) {
		this.interests = value;
	}

    /**
     * Getter $userId
     * @return {string}
     */
	public get $userId(): string {
		return this.userId;
	}

    /**
     * Setter $userId
     * @param {string} value
     */
	public set $userId(value: string) {
		this.userId = value;
	}


    /**
     * Getter $phone
     * @return {string}
     */
	public get $phone(): string {
		return this.phone;
	}

    /**
     * Setter $phone
     * @param {string} value
     */
	public set $phone(value: string) {
		this.phone = value;
	}
    /**
     * Getter $imgUrl
     * @return {string}
     */
	public get $imgUrl(): string {
		return this.imgUrl;
	}

    /**
     * Setter $imgUrl
     * @param {string} value
     */
	public set $imgUrl(value: string) {
		this.imgUrl = value;
	}


    /**
     * Getter $email
     * @return {string}
     */
	public get $email(): string {
		return this.email;
	}

    /**
     * Setter $email
     * @param {string} value
     */
	public set $email(value: string) {
		this.email = value;
	}


    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $age
     * @return {Number}
     */
	public get $age(): Number {
		return this.age;
	}

    /**
     * Getter $country
     * @return {string}
     */
	public get $country(): string {
		return this.country;
	}

    /**
     * Getter $state
     * @return {string}
     */
	public get $state(): string {
		return this.state;
	}


    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $age
     * @param {Number} value
     */
	public set $age(value: Number) {
		this.age = value;
	}

    /**
     * Setter $country
     * @param {string} value
     */
	public set $country(value: string) {
		this.country = value;
	}

    /**
     * Setter $state
     * @param {string} value
     */
	public set $state(value: string) {
		this.state = value;
	}

    
}