from django.db.models import F
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from .models import Question, Choice, Tags
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from django.http.request import HttpRequest
from datetime import datetime
import json
import logging
from django.db.models import Q

logger = logging.getLogger(__name__)

# Create your views here.
def get_request_example(request):
    print(request.GET)
    data = dict()
    return render(request, {})

class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by('-pub_date')[:5]

class DetailView(generic.DetailView):
    model = Question
    template_name = "polls/detail.html"

class ResultsView(generic.DetailView):
    model = Question
    template_name = "polls/results.html"

def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected_choice.votes = F("votes") + 1
        selected_choice.save()
        return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))

@csrf_exempt

def polls_controller(request):
    logger.info("Received request to polls_controller")
    print(request.GET)
    if request.method == "GET":
        polls = Question.objects.prefetch_related('choice_set')
        data = []
        for poll in polls:
            choices = {}
            for choice in poll.choice_set.all():
                choices[choice.choice_text] = choice.votes
            poll_data = {
                'Question': poll.question_text,
                'QuestionID': poll.id,
                'Tags': [tag.tag_name for tag in poll.tags.all()],
                'OptionVote': choices
            }
            data.append(poll_data)
        json_response = JsonResponse({
            'msg': 'Fetched polls successfully',
            'data': data,
            'success': True
        }, safe=False)
        return json_response
        
    elif request.method == "POST":
        try:
            request_body = request.body.decode('utf-8')
            request_data = json.loads(request_body)
            logger.info("Received request body: %s", request_body)
            print(f"Request body: {request_body}")

            question_text = request_data.get("Question")
            option_vote = request_data.get("OptionVote")
            tag_names = request_data.get("Tags")

        # Create a new Question object
            question = Question.objects.create(
                question_text=question_text,
                pub_date=datetime.now()
            )

        # Create Tag objects and associate them with the Question
            for tag_name in tag_names:
                tag, _ = Tags.objects.get_or_create(tag_name=tag_name)
                question.tags.add(tag)

        # Create Choice objects for the Question
            for choice_text, votes in option_vote.items():
                Choice.objects.create(question=question, choice_text=choice_text, votes=votes)

            response_data = {"msg": "Poll created successfully.", "success": True}
            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)    

def goat_footballer(request):
    data = {
        {
           "Question": "Who will win the Champions League season?",
           "QuestionID": 5,
           "Tags": [
               "cricket",
               "sports"
           ],
           "OptionVote": {
               "Real Madrid": 3,
               "Bayern": 0,
               "PSG": 3
           }
       },
       {
        "Tags": ["cricket", "sports"]
       }
    } 
    
    return JsonResponse(data, {"error": "Invalid request method"}, status=405)


def get_filter_polls(request):
    try:
        # Get the 'tags' parameter from the query string
        tags_str = request.GET.get('tags', '')
        tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
        print(f"Tags (list of strings): {tags}")

        # Filter the polls based on the 'tags' parameter if provided
        if tags:
            filtered_polls = Question.objects.filter(tags__tag_name__in=tags).distinct().prefetch_related('choice_set', 'tags')
        else:
            filtered_polls = Question.objects.all().prefetch_related('choice_set', 'tags')
        print(f"Filtered Polls: {filtered_polls}")

        data = []
        for poll in filtered_polls:
            choices = {}
            for choice in poll.choice_set.all():
                choices[choice.choice_text] = choice.votes

            poll_data = {
                'Question': poll.question_text,
                'QuestionID': poll.id,
                'Tags': [tag.tag_name for tag in poll.tags.all()],
                'OptionVote': choices
            }
            data.append(poll_data)

            # Print poll details in the terminal
            print(f"Question: {poll.question_text}")
            print(f"Question ID: {poll.id}")
            print(f"Tags: {[tag.tag_name for tag in poll.tags.all()]}")
            print(f"OptionVote: {choices}")
            print("-" * 20)

        if not data:
            print("No polls found for the given tags.")

        response_data = {
            'msg': 'Fetched polls successfully',
            'data': data,
            'success': True
        }

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def increment_poll_vote(request, question_id):
    logger.info("Received request to increment_poll_vote")
    try:
        # Get the Question object
        question = get_object_or_404(Question, pk=question_id)

        # Get the request body
        request_body = request.body.decode('utf-8')
        request_data = json.loads(request_body)
        logger.info("Received request body: %s", request_body)
        
        # Get the choice option to increment
        increment_option = request_data.get("incrementOption")

        # Get the Choice object for the specified option
        choice = question.choice_set.get(choice_text=increment_option)

        # Increment the vote count
        choice.votes = F("votes") + 1
        choice.save()

        response_data = {"msg": "Poll updated successfully", "success": True}
        return JsonResponse(response_data)

    except Choice.DoesNotExist:
        response_data = {"msg": "Invalid choice option", "success": False}
        return JsonResponse(response_data, status=400)
    except json.JSONDecodeError:
        response_data = {"msg": "Invalid JSON data", "success": False}
        return JsonResponse(response_data, status=400)
    except Exception as e:
        response_data = {"msg": str(e), "success": False}
        return JsonResponse(response_data, status=500)
@csrf_exempt   
def get_poll_data(request, question_id):
    logger.info("Received request to get_poll_data")
    try:
        if request.method == "GET":
            poll = Question.objects.filter(id=question_id).prefetch_related('choice_set', 'tags').first()
            if poll:
                choices = {choice.choice_text: choice.votes for choice in poll.choice_set.all()}
                poll_data = {
                    'Question': poll.question_text,
                    'QuestionID': poll.id,
                    'Tags': [tag.tag_name for tag in poll.tags.all()],
                    'OptionVote': choices
                }
                return JsonResponse({
                    'msg': 'Fetched poll successfully',
                    'data': poll_data,
                    'success': True
                }, safe=False)
            else:
                return JsonResponse({"error": "Poll not found"}, status=404)
        else:
            return JsonResponse({"error": "Invalid request method"}, status=405)
    except Exception as e:
        logger.error(f"Error in get_poll_data: {e}")
        return JsonResponse({"error": str(e)}, status=500)
def list_tags(request):
    try:
        # Get all unique tags from the Tags model
        tags = Tags.objects.values_list('tag_name', flat=True).distinct()
        return JsonResponse({
            "msg": "Fetched tags successfully",
            "data": list(tags),
            "success": True
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_empty_polls(request):
    try:
        # Find and delete empty poll questions
        empty_polls = Question.objects.filter(Q(question_text="") | Q(question_text__isnull=True))
        empty_poll_count = empty_polls.count()
        empty_polls.delete()
        return JsonResponse({"msg": f"Deleted {empty_poll_count} empty poll(s) successfully.", "success": True})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_empty_tags(request):
    try:
        # Find and delete empty tags
        empty_tags = Tags.objects.filter(Q(tag_name="") | Q(tag_name__isnull=True))
        empty_tag_count = empty_tags.count()
        empty_tags.delete()
        return JsonResponse({"msg": f"Deleted {empty_tag_count} empty tag(s) successfully.", "success": True})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)