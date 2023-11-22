import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import {environment} from '../environments/environment';
import {Observable, from, pipe} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Injectable({
	providedIn: "root"
})
export class OpenAiService{

	readonly configuration = new Configuration({
	  apiKey: environment.OPENAI_API_KEY,
	});
	
	readonly openai = new OpenAIApi(this.configuration);

	constructor(){
	}

	/*async function fetchMovieTitles(inputText: string) {
		mPrompt = `Suggest 5 movie titles for synopsis given in triple backticks in no more than 3 words. '''${inputText}'''. List your response in sequence in ascending order of title length.`
	  	const completion = await openai.completions.create({
		    model: "gpt-3.5-turbo-instruct",
		    prompt: mPrompt,
		    temperature: 0,
	  	});

	  	console.log(completion);

	  	return completion.data.choices[0].text;
	}*/

	getTitleForMovie(synopsis: string): Observable<any> {
		var mPrompt = `Suggest an exiting, attractive and marketable movie title for the synopsis in triple backticks.
						'''
						${synopsis}
						'''
						`
	    return from(this.openai.createCompletion({
	      model: "gpt-3.5-turbo-instruct",
	      prompt: mPrompt,
	      temperature: 0.5,
	      "max_tokens": 25
	    })).pipe(
	      filter((resp: any) => {
	      	return !!resp && !!resp.data;
	      }),
	      map((resp:any) => resp.data),
	      filter((data: any) => data.choices && data.choices.length > 0 && data.choices[0].text),
	      map((data:any) => data.choices[0].text)
	    );
	}

	getStarsPlayingRoles(synopsis: string): Observable<any> {
		var mPrompt = `Suggest movie stars for synopsis. Your reply should be in json format
						###
						synopsis: This is a story of Dr. Strange who fell in love with a beautiful girl Sarah William. They both together developed AI system which would improve the world.
						players: {
							"Dr. Strange": "Tom Cruise",
							"Sarah William": "Deepika Podukone"
						}
						###
						'''
						synopsis: ${synopsis},
						players:
						'''
						Do no include synopsis in your reply
						`
	    return from(this.openai.createCompletion({
	      model: "gpt-3.5-turbo-instruct",
	      prompt: mPrompt,
	      temperature: 0.5,
	      "max_tokens": 100
	    })).pipe(
	      filter((resp: any) => {
	      	return !!resp && !!resp.data;
	      }),
	      map((resp:any) => resp.data),
	      filter((data: any) => data.choices && data.choices.length > 0 && data.choices[0].text),
	      map((data:any) => data.choices[0].text)
	    );
	}

	getSynopsisFromOneLine(userInput: string): Observable<any>{
		var mPrompt = `Generate an engaging, professional and marketable movie synopsis based on an outline. 
				    ###
				    outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
				    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.  
				    ###
				    outline: ${userInput}
				    synopsis: 
				    `;
	    return from(this.openai.createCompletion({
	      model: "gpt-3.5-turbo-instruct",
	      prompt: mPrompt,
	      temperature: 0.4,
	      "max_tokens": 400
	    })).pipe(
	      filter((resp: any) => {
	      	return !!resp && !!resp.data;
	      }),
	      map((resp:any) => resp.data),
	      filter((data: any) => data.choices && data.choices.length > 0 && data.choices[0].text),
	      map((data:any) => data.choices[0].text)
	    );
	}

	fetchImagePrompt(title: string, synopsis: string): Observable<any>{
		var mPrompt = `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
					    ###
					    title: Love's Time Warp
					    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
					    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
					    ###
					    title: zero Earth
					    synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
					    image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
					    ###
					    title: ${title}
					    synopsis: ${synopsis}
					    image description: 
					    `;
		return from(this.openai.createCompletion({
	      model: "gpt-3.5-turbo-instruct",
	      prompt: mPrompt,
	      temperature: 0.4,
	      "max_tokens": 100
	    })).pipe(
	      filter((resp: any) => {
	      	return !!resp && !!resp.data;
	      }),
	      map((resp:any) => resp.data),
	      filter((data: any) => data.choices && data.choices.length > 0 && data.choices[0].text),
	      map((data:any) => data.choices[0].text)
	    );
	}

	/*fetchImagePrompts(title: string, synopsis: ): Observable<any>{
		return from(this.openai.createCompletion({
	      model: "gpt-3.5-turbo-instruct",
	      prompt: mPrompt,
	      temperature: 0.4,
	      "max_tokens": 100
	    })).pipe(
	      filter((resp: any) => {
	      	return !!resp && !!resp.data;
	      }),
	      map((resp:any) => resp.data),
	      filter((data: any) => data.choices && data.choices.length > 0 && data.choices[0].text),
	      map((data:any) => data.choices[0].text)
	    );
	}*/

	generateImageUsingAI(prompt: string, imageCount: number=1, size: string="256X256"): Observable<any>{
		return from(this.openai.createImage({
			"prompt": `${prompt}. There should be no text in this image`,
			"n": 1,
			size: "256x256",
			response_format: 'url'
		})).pipe(
			filter((resp: any) => {
				return !!resp && !!resp.data;
			}),
			map((resp: any)=>resp.data),
			filter((data: any) => data.data && data.data.length > 0 && data.data[0].url),
	      	map((data:any) => data.data[0].url)

	      	//To get image in base64 json encoded format
	      	// data.data[0].base64_json
	      	// <img src="data:image/png;base64,${response.data.data[0].b64_json}">`
		)
	}
}